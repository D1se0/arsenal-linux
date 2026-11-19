import type { Role } from '../types';

export type ScriptLanguage = 'bash' | 'python';
export type ScriptRole = Role;
export type ScriptLevel = 'base' | 'intermedio' | 'avanzado';

export interface ScriptTopic {
  id: string;
  title: string;
  summary: string;
  role: ScriptRole;
  level: ScriptLevel;
  syntax: string;
  code: string;
  output?: string;
  points: string[];
  gotcha?: string;
}

export interface ScriptChapter {
  id: string;
  title: string;
  summary: string;
  topics: ScriptTopic[];
}

export interface ScriptRecipe {
  id: string;
  title: string;
  role: ScriptRole;
  summary: string;
  code: string;
  tags: string[];
}

export interface ScriptReference {
  label: string;
  url: string;
}

export interface ScriptManual {
  id: ScriptLanguage;
  label: string;
  version: string;
  accent: string;
  headline: string;
  description: string;
  chapters: ScriptChapter[];
  recipes: ScriptRecipe[];
  references: ScriptReference[];
}
