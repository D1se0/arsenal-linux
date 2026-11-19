import { COMMANDS, COMMAND_BY_ID, COMMAND_STATS, RELATED_BY_COMMAND } from '../src/data/commands';
import { CATEGORIES, CATEGORY_BY_ID } from '../src/data/categories';
import { DANGERS, DIFFICULTIES, ROLES, TACTICS } from '../src/data/types';
import type { Command } from '../src/data/types';
import { BUILDER_SPECS } from '../src/data/builder';
import { LEARNING_PATHS, CHEATSHEETS, GLOSSARY, FAQS } from '../src/data/site';

const errors: string[] = [];
const warnings: string[] = [];
const ids = new Set<string>();

const categoryIds = new Set(CATEGORIES.map((category) => category.id));
const roleIds = new Set(ROLES.map((role) => role.id));
const tacticIds = new Set<string>(TACTICS);

function required(command: Command, field: keyof Command) {
  const value = command[field];
  if (value === undefined || value === null || value === '') {
    errors.push(`${command.id}: campo obligatorio vacío (${String(field)})`);
  }
}

for (const command of COMMANDS) {
  if (ids.has(command.id)) errors.push(`ID duplicado: ${command.id}`);
  ids.add(command.id);

  if (!/^[a-z0-9-]+$/.test(command.id)) errors.push(`${command.id}: el id solo debe usar minúsculas, números y guiones`);
  for (const field of ['id', 'name', 'summary', 'description', 'syntax'] as const) required(command, field);
  if (!categoryIds.has(command.category)) errors.push(`${command.id}: categoría desconocida (${command.category})`);
  if (!ROLES.some((role) => role.id === command.category) && !CATEGORY_BY_ID[command.category]) {
    errors.push(`${command.id}: categoría inválida`);
  }
  if (!roleIds.has(command.roles[0])) errors.push(`${command.id}: rol inválido`);
  if (!command.roles.length) errors.push(`${command.id}: sin roles`);
  if (!DIFFICULTIES.includes(command.difficulty)) errors.push(`${command.id}: dificultad inválida`);
  if (!DANGERS.includes(command.danger)) errors.push(`${command.id}: riesgo inválido`);
  if (!command.params.length) errors.push(`${command.id}: sin parámetros`);
  if (command.examples.length < 2) warnings.push(`${command.id}: menos de dos ejemplos`);
  if (!command.tips.length) errors.push(`${command.id}: sin consejos`);
  if (!command.tags.length) errors.push(`${command.id}: sin tags`);
  for (const param of command.params) {
    if (!param.flag || !param.desc) errors.push(`${command.id}: parámetro incompleto`);
  }
  for (const example of command.examples) {
    if (!roleIds.has(example.kind)) errors.push(`${command.id}: tipo de ejemplo inválido (${example.kind})`);
    if (!example.code.trim() || !example.explain.trim() || !example.title.trim()) {
      errors.push(`${command.id}: ejemplo incompleto (${example.title})`);
    }
  }
  for (const tactic of command.tactics ?? []) {
    if (!tacticIds.has(tactic)) errors.push(`${command.id}: táctica desconocida (${tactic})`);
  }
  for (const relatedId of command.related ?? []) {
    if (!COMMAND_BY_ID.has(relatedId)) warnings.push(`${command.id}: related inexistente (${relatedId})`);
  }
}

for (const category of CATEGORIES) {
  if (!COMMANDS.some((command) => command.category === category.id)) {
    errors.push(`Categoría sin comandos: ${category.id}`);
  }
}

for (const spec of BUILDER_SPECS) {
  if (!COMMAND_BY_ID.has(spec.commandId)) errors.push(`Constructor: comando inexistente (${spec.commandId})`);
  if (!spec.flags.length) errors.push(`Constructor: ${spec.id} sin flags`);
  for (const defaultFlag of spec.defaults) {
    if (!spec.flags.some((flag) => flag.flag === defaultFlag)) {
      errors.push(`Constructor: ${spec.id} usa una flag por defecto inexistente (${defaultFlag})`);
    }
  }
}

for (const path of LEARNING_PATHS) {
  if (!path.steps.length) errors.push(`Ruta sin pasos: ${path.id}`);
  for (const step of path.steps) {
    if (!COMMAND_BY_ID.has(step.commandId)) errors.push(`Ruta ${path.id}: comando inexistente (${step.commandId})`);
  }
}

for (const sheet of CHEATSHEETS) {
  if (!sheet.items.length) errors.push(`Chuleta sin items: ${sheet.id}`);
  for (const item of sheet.items) {
    if (!item.label || !item.code || !item.desc) errors.push(`Chuleta ${sheet.id}: item incompleto`);
  }
}

if (GLOSSARY.length < 10) warnings.push('Glosario con pocos términos');
if (FAQS.length < 5) warnings.push('Pocas preguntas frecuentes');

const examples = COMMANDS.reduce((total, command) => total + command.examples.length, 0);
const params = COMMANDS.reduce((total, command) => total + command.params.length, 0);
const withDanglingRelated = [...RELATED_BY_COMMAND.entries()].filter(
  ([id, related]) => related.length !== (COMMAND_BY_ID.get(id)?.related?.length ?? 0),
).length;

console.log('Arsenal Linux · validación de contenido');
console.log('---------------------------------------');
console.log(`Comandos:        ${COMMAND_STATS.commands}`);
console.log(`Categorías:      ${CATEGORIES.length}`);
console.log(`Ejemplos:        ${examples}`);
console.log(`Parámetros:      ${params}`);
console.log(`Rutas:           ${LEARNING_PATHS.length}`);
console.log(`Chuletas:        ${CHEATSHEETS.length} (${CHEATSHEETS.reduce((total, sheet) => total + sheet.items.length, 0)} entradas)`);
console.log(`Glosario:        ${GLOSSARY.length} términos`);
console.log(`FAQ:             ${FAQS.length}`);
console.log(`Relaciones rotas corregidas en runtime: ${withDanglingRelated}`);

if (warnings.length) {
  console.log(`\nAvisos (${warnings.length}):`);
  warnings.forEach((warning) => console.log(`  · ${warning}`));
}

if (errors.length) {
  console.error(`\nErrores (${errors.length}):`);
  errors.forEach((error) => console.error(`  ✗ ${error}`));
  process.exit(1);
}

console.log('\n✓ Contenido válido: IDs únicos, campos completos y referencias coherentes.');
