import type { ReactNode } from 'react';
import {
  Bug,
  Check,
  Cloud,
  Copy,
  Globe,
  Key,
  Lock,
  Network,
  Radar,
  ScanLine,
  Server,
  Shield,
  Swords,
  Terminal,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { CATEGORY_BY_ID } from '../data/categories';
import type { Command, Danger, Role } from '../data/types';
import { useCopy, useCountUp } from '../hooks';
import { cn, DANGER_META, formatNumber, ROLE_META } from '../lib/utils';

const ICONS: Record<string, LucideIcon> = {
  radar: Radar,
  scan: ScanLine,
  globe: Globe,
  swords: Swords,
  key: Key,
  network: Network,
  server: Server,
  terminal: Terminal,
  shield: Shield,
  lock: Lock,
  bug: Bug,
  wifi: Wifi,
  cloud: Cloud,
};

export function CategoryIcon({
  categoryId,
  size = 16,
  className,
}: {
  categoryId: string;
  size?: number;
  className?: string;
}) {
  const category = CATEGORY_BY_ID[categoryId as keyof typeof CATEGORY_BY_ID];
  const Icon = ICONS[category?.icon ?? 'terminal'] ?? Terminal;
  return <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />;
}

export function CopyButton({
  value,
  label = 'Copiar',
  className,
  compact = false,
  title,
}: {
  value: string;
  label?: string;
  className?: string;
  compact?: boolean;
  title?: string;
}) {
  const { copied, copy } = useCopy();
  const isCopied = copied !== null;
  return (
    <button
      type="button"
      className={cn('copy-btn', compact && 'copy-btn--compact', isCopied && 'is-copied', className)}
      onClick={(event) => {
        event.stopPropagation();
        void copy(value);
      }}
      title={title ?? label}
      aria-label={title ?? label}
    >
      {isCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {!compact && <span>{isCopied ? 'Copiado' : label}</span>}
      {compact && <span className="sr-only" aria-live="polite">{isCopied ? 'Copiado' : label}</span>}
    </button>
  );
}

export function CategoryChip({ command, onClick }: { command: Command; onClick?: () => void }) {
  const category = CATEGORY_BY_ID[command.category];
  const content = (
    <>
      <CategoryIcon categoryId={command.category} size={13} />
      {category.label}
    </>
  );
  if (onClick) {
    return (
      <button type="button" className={`category-chip accent-${category.accent}`} onClick={onClick}>
        {content}
      </button>
    );
  }
  return <span className={`category-chip accent-${category.accent}`}>{content}</span>;
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`role-badge role-badge--${role}`}>
      <i aria-hidden="true" />
      {ROLE_META[role].label}
    </span>
  );
}

export function DangerPips({ danger, withLabel = false }: { danger: Danger; withLabel?: boolean }) {
  const meta = DANGER_META[danger];
  return (
    <span className={`danger danger--${danger}`} title={meta.label}>
      <span className="danger__pips" aria-hidden="true">
        {[1, 2, 3, 4].map((level) => (
          <i key={level} className={level <= meta.level ? 'is-on' : undefined} />
        ))}
      </span>
      <span className="danger__label">{withLabel ? meta.label : meta.label.replace('Riesgo ', '')}</span>
    </span>
  );
}

export function DifficultyBadge({ value }: { value: string }) {
  return <span className={`difficulty difficulty--${value}`}>{value}</span>;
}

export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const current = useCountUp(value);
  return (
    <span>
      {formatNumber(current)}
      {suffix}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  description,
  center = false,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
  aside?: ReactNode;
}) {
  return (
    <div className={cn('section-head', center && 'section-head--center')} data-reveal>
      <div>
        <p className="eyebrow">
          <span className="live-dot" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2>{title}</h2>
      </div>
      {description && <p className="section-head__copy">{description}</p>}
      {aside}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}
