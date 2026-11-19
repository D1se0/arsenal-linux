import { describe, expect, it } from 'vitest';
import { BUILDER_SPECS } from './builder';
import { CATEGORIES } from './categories';
import { COMMANDS, COMMAND_BY_ID, COMMAND_STATS } from './commands';
import { SCRIPT_MANUALS, SCRIPT_STATS } from './scripting';
import { LEARNING_PATHS } from './site';
import { DIFFICULTIES, DANGERS, ROLES, TACTICS } from './types';

describe('command database', () => {
  it('tiene una base amplia y sin IDs duplicados', () => {
    expect(COMMANDS.length).toBeGreaterThanOrEqual(315);
    expect(new Set(COMMANDS.map((command) => command.id)).size).toBe(COMMANDS.length);
    expect(COMMAND_STATS.examples).toBeGreaterThan(950);
    expect(COMMAND_STATS.parameters).toBeGreaterThan(2250);
    expect(COMMAND_STATS.subparameters).toBeGreaterThan(600);
  });

  it('expone subopciones explicadas en los parámetros que las admiten', () => {
    const nmap = COMMAND_BY_ID.get('nmap');
    const john = COMMAND_BY_ID.get('john');
    const sqlmap = COMMAND_BY_ID.get('sqlmap');
    expect(nmap?.params.find((param) => param.flag === '--script <nombre>')?.options?.length).toBeGreaterThanOrEqual(15);
    expect(john?.params.find((param) => param.flag === '--format=<formato>')?.options?.length).toBeGreaterThanOrEqual(10);
    expect(sqlmap?.params.find((param) => param.flag === '--technique <letras>')?.options?.length).toBe(6);
    expect(COMMAND_STATS.documentedOptions).toBe(
      COMMAND_STATS.parameters + COMMAND_STATS.subparameters,
    );
    for (const command of COMMANDS) {
      for (const param of command.params) {
        for (const option of param.options ?? []) {
          expect(option.value.trim(), `${command.id}/${param.flag}`).toBeTruthy();
          expect(option.desc.length, `${command.id}/${param.flag}/${option.value}`).toBeGreaterThan(15);
        }
      }
    }
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

describe('scripting manuals', () => {
  it('incluye dos manuales amplios, con capítulos y recetas suficientes', () => {
    expect(SCRIPT_MANUALS.map((manual) => manual.id)).toEqual(['bash', 'python']);
    expect(SCRIPT_STATS.chapters).toBeGreaterThanOrEqual(12);
    expect(SCRIPT_STATS.topics).toBeGreaterThanOrEqual(80);
    expect(SCRIPT_STATS.recipes).toBeGreaterThanOrEqual(16);
    expect(SCRIPT_STATS.examples).toBe(SCRIPT_STATS.topics + SCRIPT_STATS.recipes);

    for (const manual of SCRIPT_MANUALS) {
      const topics = manual.chapters.flatMap((chapter) => chapter.topics);
      expect(topics.length, manual.id).toBeGreaterThanOrEqual(35);
      expect(manual.chapters.length, manual.id).toBeGreaterThanOrEqual(6);
      expect(manual.recipes.length, manual.id).toBeGreaterThanOrEqual(8);
      expect(manual.references.length, manual.id).toBeGreaterThanOrEqual(4);
      expect(manual.description.length, manual.id).toBeGreaterThan(100);

      for (const chapter of manual.chapters) {
        expect(chapter.topics.length, `${manual.id}/${chapter.id}`).toBeGreaterThanOrEqual(5);
        expect(chapter.summary.length, `${manual.id}/${chapter.id}`).toBeGreaterThan(50);
      }

      const ids = [...topics, ...manual.recipes].map((item) => item.id);
      expect(new Set(ids).size, `${manual.id} IDs duplicados`).toBe(ids.length);
    }

    for (const role of ROLES) {
      expect(SCRIPT_STATS.byRole[role.id], role.id).toBeGreaterThan(10);
    }
  });

  it('cada tema tiene sintaxis, código, explicación y errores típicos', () => {
    const levels = ['base', 'intermedio', 'avanzado'];
    for (const manual of SCRIPT_MANUALS) {
      for (const chapter of manual.chapters) {
        for (const topic of chapter.topics) {
          const label = `${manual.id}/${chapter.id}/${topic.id}`;
          expect(topic.title.length, label).toBeGreaterThan(8);
          expect(topic.summary.length, label).toBeGreaterThan(45);
          expect(topic.syntax.trim().length, label).toBeGreaterThan(0);
          expect(topic.code.trim().length, label).toBeGreaterThan(30);
          expect(topic.points.length, label).toBeGreaterThanOrEqual(3);
          expect(levels, label).toContain(topic.level);
          expect(ROLES.some((role) => role.id === topic.role), label).toBe(true);
        }
      }

      for (const recipe of manual.recipes) {
        const label = `${manual.id}/recipe/${recipe.id}`;
        expect(recipe.title.length, label).toBeGreaterThan(8);
        expect(recipe.summary.length, label).toBeGreaterThan(40);
        expect(recipe.code.trim().length, label).toBeGreaterThan(80);
        expect(recipe.tags.length, label).toBeGreaterThanOrEqual(2);
        expect(ROLES.some((role) => role.id === recipe.role), label).toBe(true);
      }
    }
  });

  it('cubre las áreas clave de Bash y Python', () => {
    const bash = SCRIPT_MANUALS.find((manual) => manual.id === 'bash');
    const python = SCRIPT_MANUALS.find((manual) => manual.id === 'python');
    expect(bash).toBeTruthy();
    expect(python).toBeTruthy();

    const bashTopics = bash!.chapters.flatMap((chapter) => chapter.topics.map((topic) => topic.id));
    const pythonTopics = python!.chapters.flatMap((chapter) => chapter.topics.map((topic) => topic.id));

    expect(bashTopics).toEqual(
      expect.arrayContaining([
        'shebang',
        'variables',
        'quoting',
        'arrays',
        'if',
        'case',
        'for',
        'while',
        'read',
        'funcion-local',
        'getopts',
        'expansion',
        'trap',
        'flock',
        'strict-mode',
      ]),
    );
    expect(pythonTopics).toEqual(
      expect.arrayContaining([
        'interprete',
        'venv',
        'main',
        'argparse',
        'listas',
        'diccionarios',
        'match',
        'for',
        'while',
        'def',
        'decoradores',
        'generadores',
        'clases',
        'dataclasses',
        'try',
        'pathlib',
        'json',
        'subprocess',
        'threading',
        'asyncio',
        'secretos',
        'calidad',
      ]),
    );
  });
});
