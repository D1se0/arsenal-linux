import type { ScriptManual, ScriptRole } from './types';
import { BASH_MANUAL } from './bash';
import { PYTHON_MANUAL } from './python';

export * from './types';
export { BASH_MANUAL, PYTHON_MANUAL };

export const SCRIPT_MANUALS: ScriptManual[] = [BASH_MANUAL, PYTHON_MANUAL];

export const SCRIPT_MANUAL_BY_ID = new Map(SCRIPT_MANUALS.map((manual) => [manual.id, manual]));

export const SCRIPT_ROLES: ScriptRole[] = ['red', 'blue', 'admin', 'network'];

const topics = SCRIPT_MANUALS.flatMap((manual) => manual.chapters.flatMap((chapter) => chapter.topics));
const recipes = SCRIPT_MANUALS.flatMap((manual) => manual.recipes);

export const SCRIPT_STATS = {
  manuals: SCRIPT_MANUALS.length,
  chapters: SCRIPT_MANUALS.reduce((total, manual) => total + manual.chapters.length, 0),
  topics: topics.length,
  recipes: recipes.length,
  examples: topics.length + recipes.length,
  byRole: Object.fromEntries(
    SCRIPT_ROLES.map((role) => [
      role,
      topics.filter((topic) => topic.role === role).length +
        recipes.filter((recipe) => recipe.role === role).length,
    ]),
  ) as Record<ScriptRole, number>,
};
