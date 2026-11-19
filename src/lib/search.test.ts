import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '../data/categories';
import { COMMANDS, CATEGORY_COUNTS, ROLE_COUNTS } from '../data/commands';
import { DANGERS, DIFFICULTIES, ROLES } from '../data/types';
import type { ExplorerFilters } from './search';
import { filterCommands, normalize, scoreCommand, suggestCommands } from './search';

function filters(overrides: Partial<ExplorerFilters> = {}): ExplorerFilters {
  return {
    query: '',
    categories: [],
    roles: [],
    difficulties: [],
    dangers: [],
    favoritesOnly: false,
    favorites: [],
    sort: 'relevance',
    ...overrides,
  };
}

describe('search engine', () => {
  it('normaliza acentos y mayúsculas', () => {
    expect(normalize('AUTENTICACIÓN')).toBe('autenticacion');
  });

  it('encuentra por nombre, alias y flag', () => {
    expect(filterCommands(COMMANDS, filters({ query: 'nmap' }))[0].id).toBe('nmap');
    expect(filterCommands(COMMANDS, filters({ query: '-sV' })).some((command) => command.id === 'nmap')).toBe(true);
    expect(filterCommands(COMMANDS, filters({ query: 'jwt_tool' })).some((command) => command.id === 'jwt-tool')).toBe(true);
  });

  it('encuentra por tag y táctica sin acentos', () => {
    expect(filterCommands(COMMANDS, filters({ query: 'kerberos' })).some((command) => command.id === 'impacket-getuserspns')).toBe(true);
    expect(filterCommands(COMMANDS, filters({ query: 'reconocimiento' })).length).toBeGreaterThan(3);
    expect(filterCommands(COMMANDS, filters({ query: 'credenciales' })).length).toBeGreaterThan(3);
  });

  it('exige que todos los términos coincidan', () => {
    expect(scoreCommand(COMMANDS.find((command) => command.id === 'nmap')!, 'nmap puertos')).toBeGreaterThan(0);
    expect(scoreCommand(COMMANDS.find((command) => command.id === 'nmap')!, 'nmap zapato')).toBe(0);
  });

  it('filtra por categoría, rol, dificultad y riesgo', () => {
    const web = filterCommands(COMMANDS, filters({ categories: ['web'] }));
    expect(web.length).toBeGreaterThan(5);
    expect(web.every((command) => command.category === 'web')).toBe(true);

    const blue = filterCommands(COMMANDS, filters({ roles: ['blue'] }));
    expect(blue.every((command) => command.roles.includes('blue'))).toBe(true);

    const advanced = filterCommands(COMMANDS, filters({ difficulties: ['avanzado'] }));
    expect(advanced.every((command) => command.difficulty === 'avanzado')).toBe(true);

    const critical = filterCommands(COMMANDS, filters({ dangers: ['critico'] }));
    expect(critical.every((command) => command.danger === 'critico')).toBe(true);
  });

  it('respeta favoritos y ordena por riesgo', () => {
    const favorites = filterCommands(COMMANDS, filters({ favoritesOnly: true, favorites: ['nmap', 'dig'] }));
    expect(favorites.map((command) => command.id).sort()).toEqual(['dig', 'nmap']);

    const sorted = filterCommands(COMMANDS, filters({ sort: 'danger' }));
    const ranks = { bajo: 0, medio: 1, alto: 2, critico: 3 } as const;
    for (let i = 1; i < sorted.length; i += 1) {
      expect(ranks[sorted[i - 1].danger]).toBeGreaterThanOrEqual(ranks[sorted[i].danger]);
    }
  });

  it(`encuentra cada uno de los ${COMMANDS.length} comandos por su nombre exacto`, () => {
    for (const command of COMMANDS) {
      const results = filterCommands(COMMANDS, filters({ query: command.name }));
      expect(results[0]?.id, command.name).toBe(command.id);
    }
  }, 15_000);

  it('los contadores de todos los filtros coinciden con el catálogo', () => {
    for (const category of CATEGORIES) {
      expect(filterCommands(COMMANDS, filters({ categories: [category.id] })).length, category.id).toBe(
        CATEGORY_COUNTS[category.id],
      );
    }
    for (const role of ROLES) {
      expect(filterCommands(COMMANDS, filters({ roles: [role.id] })).length, role.id).toBe(ROLE_COUNTS[role.id]);
    }
    for (const difficulty of DIFFICULTIES) {
      const expected = COMMANDS.filter((command) => command.difficulty === difficulty).length;
      expect(filterCommands(COMMANDS, filters({ difficulties: [difficulty] })).length, difficulty).toBe(expected);
    }
    for (const danger of DANGERS) {
      const expected = COMMANDS.filter((command) => command.danger === danger).length;
      expect(filterCommands(COMMANDS, filters({ dangers: [danger] })).length, danger).toBe(expected);
    }
  });

  it('sugiere comandos populares y limita resultados', () => {
    const suggestions = suggestCommands(COMMANDS, '', 8);
    expect(suggestions).toHaveLength(8);
    expect(suggestions.map((command) => command.id)).toContain('nmap');
    expect(suggestCommands(COMMANDS, 'tcp', 4).length).toBeLessThanOrEqual(4);
  });
});
