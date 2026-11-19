import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Lightbulb,
  ListTree,
  Star,
  Terminal,
  X,
} from 'lucide-react';
import { CATEGORY_BY_ID } from '../data/categories';
import { COMMAND_BY_ID, RELATED_BY_COMMAND } from '../data/commands';
import type { Command } from '../data/types';
import { useBodyLock } from '../hooks';
import { cn, ROLE_META } from '../lib/utils';
import {
  CategoryChip,
  CategoryIcon,
  CopyButton,
  DangerPips,
  DifficultyBadge,
  RoleBadge,
} from './ui';

type DrawerTab = 'guia' | 'params' | 'ejemplos' | 'notas';

const TABS: { id: DrawerTab; label: string; icon: typeof BookOpen }[] = [
  { id: 'guia', label: 'Guía', icon: BookOpen },
  { id: 'params', label: 'Parámetros', icon: ListTree },
  { id: 'ejemplos', label: 'Ejemplos', icon: Terminal },
  { id: 'notas', label: 'Notas', icon: Lightbulb },
];

export function CommandDrawer({
  command,
  onClose,
  onOpenCommand,
  favorite,
  onToggleFavorite,
}: {
  command: Command | null;
  onClose: () => void;
  onOpenCommand: (id: string) => void;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const [tab, setTab] = useState<DrawerTab>('guia');
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useBodyLock(Boolean(command));

  useEffect(() => {
    if (!command) return;
    setTab('guia');
    bodyRef.current?.scrollTo(0, 0);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [command]);

  useEffect(() => {
    if (!command) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [command, onClose]);

  if (!command) return null;

  const category = CATEGORY_BY_ID[command.category];
  const related = (RELATED_BY_COMMAND.get(command.id) ?? [])
    .map((id) => COMMAND_BY_ID.get(id))
    .filter((item): item is Command => Boolean(item));
  const shareLink = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?cmd=${command.id}`
    : '';
  const optionCount = command.params.reduce(
    (total, param) => total + (param.options?.length ?? 0),
    0,
  );

  return (
    <div className="drawer" role="presentation">
      <div className="drawer__backdrop" onClick={onClose} aria-hidden="true" />
      <section
        className={cn('drawer__panel', `accent-${category.accent}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-title"
      >
        <div className="drawer__bar">
          <CategoryChip command={command} />
          <div className="drawer__bar-actions">
            <CopyButton value={shareLink} label="Enlace" className="drawer__link" />
            <button
              type="button"
              className={cn('icon-button favorite-btn', favorite && 'is-active')}
              onClick={() => onToggleFavorite(command.id)}
              aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              aria-pressed={favorite}
              title={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Star size={16} fill={favorite ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              ref={closeRef}
              className="icon-button"
              onClick={onClose}
              aria-label="Cerrar ficha"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="drawer__scroll" ref={bodyRef}>
          <header className="drawer__hero">
            <p className="eyebrow">
              <CategoryIcon categoryId={command.category} size={12} />
              Dossier de comando · {category.label}
            </p>
            <h2 id="command-title">
              <span aria-hidden="true">$ </span>
              {command.name}
            </h2>
            <p className="drawer__summary">{command.summary}</p>
            <div className="drawer__meta">
              <DifficultyBadge value={command.difficulty} />
              <DangerPips danger={command.danger} withLabel />
              <div className="drawer__roles">
                {command.roles.map((role) => (
                  <RoleBadge key={role} role={role} />
                ))}
              </div>
            </div>
          </header>

          <nav className="drawer__tabs" aria-label="Secciones de la ficha">
            {TABS.map((item) => {
              const Icon = item.icon;
              const count =
                item.id === 'params'
                  ? command.params.length
                  : item.id === 'ejemplos'
                    ? command.examples.length
                    : null;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn(tab === item.id && 'is-active')}
                  onClick={() => setTab(item.id)}
                  aria-pressed={tab === item.id}
                >
                  <Icon size={14} aria-hidden="true" />
                  {item.label}
                  {count !== null && <span className="drawer__tab-count">{count}</span>}
                </button>
              );
            })}
          </nav>

          <div className="drawer__content">
            {tab === 'guia' && (
              <div className="dossier">
                <div className="dossier__block">
                  <p className="dossier__label">Qué hace</p>
                  <p className="dossier__text">{command.description}</p>
                </div>

                <div className="dossier__block">
                  <div className="dossier__block-head">
                    <p className="dossier__label">Sintaxis</p>
                    <CopyButton value={command.syntax} label="Copiar" compact />
                  </div>
                  <div className="code-block code-block--syntax">
                    <span className="code-block__prompt" aria-hidden="true">$</span>
                    <code>{command.syntax}</code>
                  </div>
                </div>

                <div className="dossier__grid">
                  <div className="dossier__block">
                    <p className="dossier__label">Para quién</p>
                    <div className="dossier__roles">
                      {command.roles.map((role) => (
                        <span key={role} className="dossier__role">
                          <i className={`role-dot--${role}`} aria-hidden="true" />
                          <strong>{ROLE_META[role].label}</strong>
                          <small>{ROLE_META[role].short}</small>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="dossier__block">
                    <p className="dossier__label">Tácticas MITRE</p>
                    {(command.tactics ?? []).length ? (
                      <div className="dossier__tactics">
                        {command.tactics?.map((tactic) => (
                          <span key={tactic} className="tactic-chip">{tactic}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="dossier__muted">Herramienta transversal de operación y auditoría.</p>
                    )}
                  </div>
                </div>

                <div className="dossier__block">
                  <p className="dossier__label">Tags</p>
                  <div className="dossier__tags">
                    {command.tags.map((tag) => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="dossier__callout">
                  <Lightbulb size={16} aria-hidden="true" />
                  <p>
                    Lee la pestaña <strong>Parámetros</strong> antes de ejecutar. La mayoría de
                    incidentes con estas herramientas vienen de una flag mal entendida, no de la
                    herramienta.
                  </p>
                </div>
              </div>
            )}

            {tab === 'params' && (
              <div className="params-panel">
                <div className="dossier__block-head params-panel__head">
                  <div>
                    <p className="dossier__label">{command.params.length} parámetros explicados</p>
                    {optionCount > 0 && (
                      <p className="params-panel__summary">
                        +{optionCount} opciones anidadas listas para desplegar
                      </p>
                    )}
                  </div>
                  <span className="params-panel__hint">Sintaxis: {command.syntax}</span>
                </div>
                <div className="params-table">
                  {command.params.map((param) => (
                    <div
                      className={cn(
                        'param-row',
                        (param.options?.length ?? 0) > 0 && 'param-row--nested',
                      )}
                      key={param.flag}
                    >
                      <code className="param-row__flag">{param.flag}</code>
                      <div className="param-row__body">
                        <p>{param.desc}</p>
                        {param.example && (
                          <code className="param-row__example">{param.example}</code>
                        )}
                        {param.options?.length ? (
                          <details className="param-options">
                            <summary>
                              <ChevronDown size={13} aria-hidden="true" />
                              <span>
                                Ver las {param.options.length} opciones de{' '}
                                <strong>{param.flag.split(' ')[0]}</strong>
                              </span>
                            </summary>
                            <ul>
                              {param.options.map((option) => (
                                <li key={option.value}>
                                  <code className="param-options__value">{option.value}</code>
                                  <div>
                                    <p>{option.desc}</p>
                                    {option.example && (
                                      <code className="param-options__example">
                                        {option.example}
                                      </code>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </details>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'ejemplos' && (
              <div className="examples-panel">
                {command.examples.map((example, index) => (
                  <article className="example" key={`${example.title}-${index}`}>
                    <div className="example__head">
                      <span className={`example__kind example__kind--${example.kind}`}>
                        {ROLE_META[example.kind].label}
                      </span>
                      <h3>{example.title}</h3>
                      <CopyButton value={example.code} compact label="Copiar ejemplo" />
                    </div>
                    <pre className="code-block">
                      <code>{example.code}</code>
                    </pre>
                    <p>{example.explain}</p>
                  </article>
                ))}
              </div>
            )}

            {tab === 'notas' && (
              <div className="notes-panel">
                <div className="dossier__block">
                  <p className="dossier__label">Buena praxis</p>
                  <ol className="tip-list">
                    {command.tips.map((tip, index) => (
                      <li key={tip}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <p>{tip}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {related.length > 0 && (
                  <div className="dossier__block">
                    <p className="dossier__label">Comandos relacionados</p>
                    <div className="related-grid">
                      {related.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="related-card"
                          onClick={() => onOpenCommand(item.id)}
                        >
                          <CategoryIcon categoryId={item.category} size={14} />
                          <span>
                            <strong>{item.name}</strong>
                            <small>{item.summary}</small>
                          </span>
                          <span aria-hidden="true">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="dossier__callout dossier__callout--warn">
                  <Terminal size={16} aria-hidden="true" />
                  <p>
                    Documentación, no ejecución. Verifica la versión instalada y usa estos comandos
                    solo sobre sistemas propios o con autorización escrita.
                  </p>
                </div>
              </div>
            )}
          </div>

          <footer className="drawer__footer">
            <CopyButton value={command.syntax} label="Copiar sintaxis" className="drawer__primary-copy" />
            <CopyButton value={shareLink} label="Copiar enlace directo" />
          </footer>
        </div>
      </section>
    </div>
  );
}
