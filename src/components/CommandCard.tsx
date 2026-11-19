import type { CSSProperties } from 'react';
import { Star } from 'lucide-react';
import { CATEGORY_BY_ID } from '../data/categories';
import type { Command } from '../data/types';
import { cn, ROLE_META } from '../lib/utils';
import { CategoryIcon, CopyButton, DangerPips, DifficultyBadge } from './ui';

export function CommandCard({
  command,
  favorite,
  onToggleFavorite,
  onOpen,
  index = 0,
}: {
  command: Command;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (id: string) => void;
  index?: number;
}) {
  const category = CATEGORY_BY_ID[command.category];
  return (
    <article
      className={cn('cmd-card', `accent-${category.accent}`)}
      style={{ '--i': Math.min(index, 12) } as CSSProperties}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
      }}
    >
      <button
        type="button"
        className="cmd-card__open"
        aria-label={`Abrir ficha de ${command.name}`}
        onClick={() => onOpen(command.id)}
      />
      <div className="cmd-card__top">
        <span className="cmd-card__cat">
          <CategoryIcon categoryId={command.category} size={13} />
          {category.label}
        </span>
        <div className="cmd-card__actions">
          <button
            type="button"
            className={cn('icon-button icon-button--sm favorite-btn', favorite && 'is-active')}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(command.id);
            }}
            aria-label={favorite ? `Quitar ${command.name} de favoritos` : `Guardar ${command.name} en favoritos`}
            aria-pressed={favorite}
            title={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Star size={14} fill={favorite ? 'currentColor' : 'none'} />
          </button>
          <CopyButton value={command.name} compact label="Copiar comando" />
        </div>
      </div>

      <h3 className="cmd-card__title">
        <span className="cmd-card__prompt" aria-hidden="true">$</span>
        {command.name}
      </h3>
      <p className="cmd-card__summary">{command.summary}</p>

      <div className="cmd-card__tags">
        {command.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>

      <div className="cmd-card__footer">
        <div className="cmd-card__roles" aria-label="Roles">
          {command.roles.map((role) => (
            <span key={role} className={`role-dot role-dot--${role}`} title={ROLE_META[role].label}>
              <i aria-hidden="true" />
              {ROLE_META[role].short}
            </span>
          ))}
        </div>
        <div className="cmd-card__meta">
          <DifficultyBadge value={command.difficulty} />
          <DangerPips danger={command.danger} />
        </div>
      </div>
    </article>
  );
}
