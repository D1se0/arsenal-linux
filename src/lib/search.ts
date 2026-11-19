import type { CategoryId, Command, Danger, Difficulty, Role } from '../data/types';
import { CATEGORY_BY_ID } from '../data/categories';

export type SortMode = 'relevance' | 'az' | 'category' | 'danger';

export interface ExplorerFilters {
  query: string;
  categories: CategoryId[];
  roles: Role[];
  difficulties: Difficulty[];
  dangers: Danger[];
  favoritesOnly: boolean;
  favorites: string[];
  sort: SortMode;
}

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function fieldScore(haystack: string, needle: string, weight: number): number {
  const value = normalize(haystack);
  if (!value) return 0;
  if (value === needle) return weight * 4;
  if (value.startsWith(needle)) return weight * 2.4;
  const index = value.indexOf(needle);
  if (index === -1) return 0;
  return weight + Math.max(0, 3 - index / 40);
}

function commandSearchText(command: Command): string[] {
  return [
    command.name,
    ...(command.aliases ?? []),
    ...command.tags,
    ...(command.tactics ?? []),
    CATEGORY_BY_ID[command.category].label,
    command.summary,
    command.description,
    command.syntax,
    ...command.params.flatMap((param) => [
      param.flag,
      param.desc,
      ...(param.options ?? []).flatMap((option) => [option.value, option.desc, option.example ?? '']),
    ]),
    ...command.examples.flatMap((example) => [example.title, example.explain, example.code]),
    ...command.tips,
  ];
}

export function scoreCommand(command: Command, query: string): number {
  const normalized = normalize(query);
  if (!normalized) return 1;
  const tokens = normalized.split(' ').filter(Boolean);
  if (!tokens.length) return 1;

  const name = normalize(command.name);
  const aliases = (command.aliases ?? []).map(normalize);
  const tags = command.tags.map(normalize);
  const category = normalize(CATEGORY_BY_ID[command.category].label);
  const summary = normalize(command.summary);
  const all = commandSearchText(command).map(normalize);

  let total = 0;
  for (const token of tokens) {
    let tokenScore = 0;
    if (name === token) tokenScore += 120;
    else if (name.startsWith(token)) tokenScore += 70;
    else if (name.includes(token)) tokenScore += 46;
    if (aliases.some((alias) => alias === token)) tokenScore += 64;
    else if (aliases.some((alias) => alias.includes(token))) tokenScore += 34;
    if (tags.some((tag) => tag === token)) tokenScore += 38;
    else if (tags.some((tag) => tag.startsWith(token))) tokenScore += 22;
    if (category.includes(token)) tokenScore += 18;
    tokenScore += fieldScore(summary, token, 8);
    if (!tokenScore) {
      const visible = all.slice(0, 6).some((field) => field.includes(token));
      tokenScore += visible ? 12 : 0;
    }
    if (!tokenScore) {
      const deep = all.some((field) => field.includes(token));
      tokenScore += deep ? 4 : 0;
    }
    if (!tokenScore) return 0;
    total += tokenScore;
  }
  return total;
}

const DANGER_RANK: Record<Danger, number> = { bajo: 0, medio: 1, alto: 2, critico: 3 };

export function filterCommands(commands: Command[], filters: ExplorerFilters): Command[] {
  const query = filters.query.trim();
  let result = commands.filter((command) => {
    if (filters.categories.length && !filters.categories.includes(command.category)) return false;
    if (filters.roles.length && !filters.roles.some((role) => command.roles.includes(role))) return false;
    if (filters.difficulties.length && !filters.difficulties.includes(command.difficulty)) return false;
    if (filters.dangers.length && !filters.dangers.includes(command.danger)) return false;
    if (filters.favoritesOnly && !filters.favorites.includes(command.id)) return false;
    if (query && scoreCommand(command, query) === 0) return false;
    return true;
  });

  if (query && filters.sort === 'relevance') {
    result = [...result].sort((a, b) => {
      const diff = scoreCommand(b, query) - scoreCommand(a, query);
      return diff !== 0 ? diff : a.name.localeCompare(b.name, 'es');
    });
  } else if (filters.sort === 'az') {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  } else if (filters.sort === 'category') {
    result = [...result].sort((a, b) => {
      const categoryDiff = a.category.localeCompare(b.category);
      return categoryDiff !== 0 ? categoryDiff : a.name.localeCompare(b.name, 'es');
    });
  } else if (filters.sort === 'danger') {
    result = [...result].sort((a, b) => {
      const diff = DANGER_RANK[b.danger] - DANGER_RANK[a.danger];
      return diff !== 0 ? diff : a.name.localeCompare(b.name, 'es');
    });
  }

  return result;
}

export function activeFilterCount(filters: ExplorerFilters): number {
  return (
    filters.categories.length +
    filters.roles.length +
    filters.difficulties.length +
    filters.dangers.length +
    (filters.favoritesOnly ? 1 : 0)
  );
}

export function suggestCommands(commands: Command[], query: string, limit = 8): Command[] {
  const trimmed = query.trim();
  if (!trimmed) {
    const featured = ['nmap', 'tcpdump', 'ffuf', 'sqlmap', 'volatility3', 'systemctl', 'dig', 'hydra'];
    return featured.map((id) => commands.find((command) => command.id === id)).filter(Boolean) as Command[];
  }
  return [...commands]
    .map((command) => ({ command, score: scoreCommand(command, trimmed) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.command.name.localeCompare(b.command.name, 'es'))
    .slice(0, limit)
    .map((entry) => entry.command);
}
