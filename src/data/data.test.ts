import { describe, expect, it } from 'vitest';
import { BUILDER_SPECS } from './builder';
import { CATEGORIES } from './categories';
import { COMMANDS, COMMAND_BY_ID, COMMAND_STATS } from './commands';
import { LEARNING_PATHS } from './site';
import { DIFFICULTIES, DANGERS, ROLES, TACTICS } from './types';

describe('command database', () => {
  it('tiene una base amplia y sin IDs duplicados', () => {
    expect(COMMANDS.length).toBeGreaterThanOrEqual(270);
    expect(new Set(COMMANDS.map((command) => command.id)).size).toBe(COMMANDS.length);
    expect(COMMAND_STATS.examples).toBeGreaterThan(800);
    expect(COMMAND_STATS.parameters).toBeGreaterThan(1900);
  });

  it('cubre todas las categorías con varios comandos', () => {
    for (const category of CATEGORIES) {
      expect(COMMANDS.filter((command) => command.category === category.id).length).toBeGreaterThanOrEqual(5);
    }
  });

  it('cada ficha tiene campos, parámetros y ejemplos completos', () => {
    for (const command of COMMANDS) {
      expect(command.name, command.id).toBeTruthy();
      expect(command.summary.length, command.id).toBeGreaterThan(20);
      expect(command.description.length, command.id).toBeGreaterThan(60);
      expect(command.params.length, command.id).toBeGreaterThan(0);
      expect(command.examples.length, command.id).toBeGreaterThanOrEqual(2);
      expect(command.tips.length, command.id).toBeGreaterThan(0);
      expect(command.tags.length, command.id).toBeGreaterThan(0);
      expect(DIFFICULTIES).toContain(command.difficulty);
      expect(DANGERS).toContain(command.danger);
      expect(ROLES.some((role) => role.id === command.roles[0]), command.id).toBe(true);
      for (const example of command.examples) {
        expect(['red', 'blue', 'admin', 'network'], command.id).toContain(example.kind);
        expect(example.code.trim().length, command.id).toBeGreaterThan(0);
      }
      for (const tactic of command.tactics ?? []) {
        expect(TACTICS).toContain(tactic);
      }
    }
  });

  it('todas las relaciones internas existen', () => {
    for (const command of COMMANDS) {
      for (const related of command.related ?? []) {
        expect(COMMAND_BY_ID.has(related), `${command.id} -> ${related}`).toBe(true);
      }
    }
  });

  it('las rutas y el constructor apuntan a comandos existentes', () => {
    for (const path of LEARNING_PATHS) {
      expect(path.steps.length).toBeGreaterThan(3);
      for (const step of path.steps) {
        expect(COMMAND_BY_ID.has(step.commandId), `${path.id} -> ${step.commandId}`).toBe(true);
      }
    }
    for (const spec of BUILDER_SPECS) {
      expect(COMMAND_BY_ID.has(spec.commandId), spec.commandId).toBe(true);
      for (const defaultFlag of spec.defaults) {
        expect(spec.flags.some((flag) => flag.flag === defaultFlag), `${spec.id} -> ${defaultFlag}`).toBe(true);
      }
    }
  });

  it('incluye los comandos esenciales de cada rol', () => {
    const essential = [
      'nmap',
      'ffuf',
      'sqlmap',
      'msfconsole',
      'tcpdump',
      'tshark',
      'volatility3',
      'systemctl',
      'journalctl',
      'chmod',
      'iptables',
      'hashcat',
      'gdb',
      'aircrack-ng',
      'trivy',
      'kubectl',
    ];
    for (const id of essential) {
      expect(COMMAND_BY_ID.has(id), id).toBe(true);
    }
  });
});
