import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import { COMMANDS } from '../data/commands';
import { suggestCommands } from '../lib/search';
import { useBodyLock } from '../hooks';
import { cn } from '../lib/utils';
import { CategoryIcon } from './ui';

export function CommandPalette({
  open,
  onClose,
  onSelect,
  onShowAll,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onShowAll: (query: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useBodyLock(open);

  const results = useMemo(() => suggestCommands(COMMANDS, query, 9), [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const select = (id: string) => {
    onSelect(id);
    onClose();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((value) => (results.length ? (value + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((value) => (results.length ? (value - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (results[active]) select(results[active].id);
      else if (query.trim()) onShowAll(query);
    }
  };

  return (
    <div className="palette" role="presentation">
      <div className="palette__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="palette__panel" role="dialog" aria-modal="true" aria-label="Búsqueda rápida de comandos">
        <div className="palette__input-wrap">
          <Search size={19} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe un comando, una flag, un tag…"
            aria-label="Buscar comandos"
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button type="button" className="palette__clear" onClick={() => setQuery('')} aria-label="Limpiar">
              <X size={15} />
            </button>
          ) : (
            <kbd className="kbd">ESC</kbd>
          )}
        </div>

        <div className="palette__meta">
          <span>{query.trim() ? `${results.length} resultados` : 'Sugerencias para empezar'}</span>
          <span>{COMMANDS.length} comandos indexados</span>
        </div>

        <div className="palette__results" role="listbox" aria-label="Resultados de búsqueda">
          {results.length === 0 ? (
            <div className="palette__empty">
              <p>No hay comandos que coincidan con «{query}».</p>
              <button type="button" className="button button--ghost" onClick={() => onShowAll(query)}>
                Ver el arsenal completo <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            results.map((command, index) => (
              <button
                key={command.id}
                type="button"
                role="option"
                aria-selected={index === active}
                className={cn('palette__item', index === active && 'is-active')}
                onMouseEnter={() => setActive(index)}
                onClick={() => select(command.id)}
              >
                <span className="palette__icon">
                  <CategoryIcon categoryId={command.category} size={16} />
                </span>
                <span className="palette__item-body">
                  <span className="palette__item-title">
                    <code>{command.name}</code>
                    <small>{command.category}</small>
                  </span>
                  <span className="palette__item-summary">{command.summary}</span>
                </span>
                <CornerDownLeft size={14} className="palette__enter" aria-hidden="true" />
              </button>
            ))
          )}
        </div>

        <div className="palette__footer">
          <span>
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd> navegar
          </span>
          <span>
            <kbd className="kbd">↵</kbd> abrir
          </span>
          {query.trim() && (
            <button type="button" className="palette__show-all" onClick={() => onShowAll(query)}>
              Ver todos en el arsenal <ArrowRight size={12} />
            </button>
          )}
          <span className="palette__brand">Arsenal Linux</span>
        </div>
      </div>
    </div>
  );
}
