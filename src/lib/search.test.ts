import { describe, expect, it } from 'vitest';
import { COMMANDS } from '../data/commands';
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

  it('sugiere comandos populares y limita resultados', () => {
    const suggestions = suggestCommands(COMMANDS, '', 8);
    expect(suggestions).toHaveLength(8);
    expect(suggestions.map((command) => command.id)).toContain('nmap');
    expect(suggestCommands(COMMANDS, 'tcp', 4).length).toBeLessThanOrEqual(4);
  });
});
