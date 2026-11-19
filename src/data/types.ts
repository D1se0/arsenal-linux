export const CATEGORY_IDS = [
  'recon',
  'scanning',
  'web',
  'exploit',
  'passwords',
  'network',
  'sysadmin',
  'shell',
  'forensics',
  'hardening',
  'malware',
  'wireless',
  'cloud',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];
export type Role = 'red' | 'blue' | 'admin' | 'network';
export type Difficulty = 'inicial' | 'intermedio' | 'avanzado';
export type Danger = 'bajo' | 'medio' | 'alto' | 'critico';

export interface CommandParam {
  flag: string;
  desc: string;
  example?: string;
}

export interface CommandExample {
  title: string;
  kind: Role;
  code: string;
  explain: string;
}

export interface Command {
  id: string;
  name: string;
  aliases?: string[];
  category: CategoryId;
  roles: Role[];
  difficulty: Difficulty;
  danger: Danger;
  summary: string;
  description: string;
  syntax: string;
  params: CommandParam[];
  examples: CommandExample[];
  tips: string[];
  tags: string[];
  tactics?: Tactic[];
  related?: string[];
}

export interface Category {
  id: CategoryId;
  label: string;
  short: string;
  description: string;
  accent: string;
  icon: string;
}

export const ROLES: { id: Role; label: string; short: string }[] = [
  { id: 'red', label: 'Red team', short: 'Ofensiva' },
  { id: 'blue', label: 'Blue team', short: 'Defensa' },
  { id: 'admin', label: 'Sysadmin', short: 'Sistemas' },
  { id: 'network', label: 'Redes', short: 'Network' },
];

export const DIFFICULTIES: Difficulty[] = ['inicial', 'intermedio', 'avanzado'];
export const DANGERS: Danger[] = ['bajo', 'medio', 'alto', 'critico'];

export const TACTICS = [
  'Reconnaissance',
  'Resource Development',
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command and Control',
  'Exfiltration',
  'Impact',
] as const;

export type Tactic = (typeof TACTICS)[number];
