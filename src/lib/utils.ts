import type { Danger, Role } from '../data/types';

export const ROLE_META: Record<Role, { label: string; short: string }> = {
  red: { label: 'Red team', short: 'Ofensiva' },
  blue: { label: 'Blue team', short: 'Defensa' },
  admin: { label: 'Sysadmin', short: 'Sistemas' },
  network: { label: 'Redes', short: 'Network' },
};

export const DANGER_META: Record<Danger, { label: string; level: number }> = {
  bajo: { label: 'Riesgo bajo', level: 1 },
  medio: { label: 'Riesgo medio', level: 2 },
  alto: { label: 'Riesgo alto', level: 3 },
  critico: { label: 'Riesgo crítico', level: 4 },
};

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-ES').format(value);
}

export async function copyToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    textarea.remove();
    return success;
  } catch {
    return false;
  }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
