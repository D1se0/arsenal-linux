import { useState } from 'react';
import { AlertTriangle, ArrowUpRight, RotateCcw, Terminal, Wand2 } from 'lucide-react';
import { BUILDER_SPECS, type BuilderFlag } from '../data/builder';
import { COMMAND_BY_ID } from '../data/commands';
import { BUILDER_SECTION_COPY } from '../data/site';
import { cn } from '../lib/utils';
import { CopyButton, SectionHead } from './ui';

const START_WITH_TARGET = new Set(['ffuf', 'find']);

export function Builder({ onOpenCommand }: { onOpenCommand: (id: string) => void }) {
  const [specId, setSpecId] = useState(BUILDER_SPECS[0].id);
  const spec = BUILDER_SPECS.find((item) => item.id === specId) ?? BUILDER_SPECS[0];
  const [target, setTarget] = useState(spec.target);
  const [selected, setSelected] = useState<string[]>(spec.defaults);
  const [values, setValues] = useState<Record<string, string>>({});

  const chooseSpec = (id: string) => {
    const next = BUILDER_SPECS.find((item) => item.id === id);
    if (!next) return;
    setSpecId(id);
    setTarget(next.target);
    setSelected(next.defaults);
    setValues({});
  };

  const toggleFlag = (flag: BuilderFlag) => {
    setSelected((list) => {
      if (list.includes(flag.flag)) return list.filter((item) => item !== flag.flag);
      if (flag.value !== undefined) {
        setValues((current) => ({ ...current, [flag.flag]: current[flag.flag] ?? flag.value ?? '' }));
      }
      return [...list, flag.flag];
    });
  };

  const reset = () => {
    setTarget(spec.target);
    setSelected(spec.defaults);
    setValues({});
  };

  const activeFlags = spec.flags.filter((flag) => selected.includes(flag.flag));
  const commandParts = [spec.base];
  if (START_WITH_TARGET.has(spec.id) && target.trim()) commandParts.push(target.trim());
  activeFlags.forEach((flag) => {
    commandParts.push(
      flag.value !== undefined ? `${flag.flag} ${values[flag.flag] ?? flag.value}` : flag.flag,
    );
  });
  if (!START_WITH_TARGET.has(spec.id) && target.trim()) commandParts.push(target.trim());
  const commandText = commandParts.join(' ');
  const command = COMMAND_BY_ID.get(spec.commandId);

  return (
    <section id="constructor" className="section builder-section">
      <div className="shell">
        <SectionHead
          eyebrow={BUILDER_SECTION_COPY.eyebrow}
          title={
            <>
              Construye el comando.
              <br />
              <em>Copia con criterio.</em>
            </>
          }
          description={BUILDER_SECTION_COPY.description}
        />

        <div className="builder" data-reveal>
          <div className="builder__controls">
            <div className="builder__specs" role="tablist" aria-label="Herramienta a construir">
              {BUILDER_SPECS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === spec.id}
                  className={cn('builder__spec', `accent-${item.accent}`, item.id === spec.id && 'is-active')}
                  onClick={() => chooseSpec(item.id)}
                >
                  <code>{item.name}</code>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>

            <div className="builder__form">
              <label className="builder__target">
                <span>{spec.targetLabel}</span>
                <input
                  type="text"
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>

              <div className="builder__flags">
                <div className="builder__flags-head">
                  <span>Flags disponibles</span>
                  <small>{activeFlags.length} activas</small>
                </div>
                {spec.flags.map((flag) => {
                  const isOn = selected.includes(flag.flag);
                  return (
                    <div key={flag.flag} className={cn('builder-flag', isOn && 'is-on', flag.danger && 'is-danger')}>
                      <button
                        type="button"
                        className="builder-flag__toggle"
                        onClick={() => toggleFlag(flag)}
                        aria-pressed={isOn}
                      >
                        <span className="builder-flag__check" aria-hidden="true">
                          {isOn ? '✓' : ''}
                        </span>
                        <code>{flag.flag}</code>
                        <span className="builder-flag__label">
                          {flag.label}
                          {flag.danger && <AlertTriangle size={11} aria-label="Opción de alto impacto" />}
                        </span>
                      </button>
                      {isOn && flag.value !== undefined && (
                        <input
                          type="text"
                          className="builder-flag__value"
                          value={values[flag.flag] ?? flag.value}
                          onChange={(event) =>
                            setValues((current) => ({ ...current, [flag.flag]: event.target.value }))
                          }
                          aria-label={`Valor para ${flag.flag}`}
                          spellCheck={false}
                        />
                      )}
                      <p className="builder-flag__note">{flag.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="builder__output">
            <div className="builder-output">
              <div className="builder-output__bar">
                <span>
                  <Terminal size={14} aria-hidden="true" /> Comando generado
                </span>
                <span className="builder-output__status">
                  <i aria-hidden="true" /> listo
                </span>
              </div>
              <div className="builder-output__code">
                <span className="code-block__prompt" aria-hidden="true">$</span>
                <code data-testid="builder-command">{commandText}</code>
              </div>
              <div className="builder-output__actions">
                <CopyButton
                  value={commandText}
                  label="Copiar comando"
                  className="drawer__primary-copy"
                />
                <button type="button" className="button button--ghost button--sm" onClick={reset}>
                  <RotateCcw size={14} aria-hidden="true" /> Restablecer
                </button>
              </div>
            </div>

            <div className="builder__explain">
              <p className="eyebrow">
                <Wand2 size={12} aria-hidden="true" /> Por qué funciona
              </p>
              {activeFlags.length === 0 ? (
                <p className="builder__empty-note">
                  Activa alguna flag para ver cómo se compone el comando y qué efecto tiene.
                </p>
              ) : (
                <ul>
                  {activeFlags.map((flag) => (
                    <li key={flag.flag}>
                      <code>{flag.flag}</code>
                      <span>{flag.note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {command && (
              <button
                type="button"
                className="builder__dossier"
                onClick={() => onOpenCommand(command.id)}
              >
                Abrir la ficha completa de <strong>{command.name}</strong>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
