import type { CSSProperties } from 'react';
import { ArrowUpRight, Check, RotateCcw } from 'lucide-react';
import { COMMAND_BY_ID } from '../data/commands';
import { LEARNING_PATHS } from '../data/site';
import { useLocalStorage } from '../hooks';
import { cn } from '../lib/utils';
import { CategoryIcon, SectionHead } from './ui';

export function Paths({ onOpenCommand }: { onOpenCommand: (id: string) => void }) {
  const [progress, setProgress] = useLocalStorage<Record<string, string[]>>('arsenal-progress', {});

  const toggleStep = (pathId: string, commandId: string) => {
    setProgress((current) => {
      const existing = current[pathId] ?? [];
      return {
        ...current,
        [pathId]: existing.includes(commandId)
          ? existing.filter((id) => id !== commandId)
          : [...existing, commandId],
      };
    });
  };

  const resetPath = (pathId: string) => {
    setProgress((current) => ({ ...current, [pathId]: [] }));
  };

  return (
    <section id="rutas" className="section paths-section">
      <div className="shell">
        <SectionHead
          eyebrow="Rutas de aprendizaje"
          title={
            <>
              No es una lista.
              <br />
              <em>Es un camino.</em>
            </>
          }
          description="Seis itinerarios con orden, motivo y progreso guardado en tu navegador. Empieza por donde estés y marca cada paso cuando lo domines."
        />

        <div className="paths">
          {LEARNING_PATHS.map((path, pathIndex) => {
            const completed = progress[path.id] ?? [];
            const percent = Math.round((completed.length / path.steps.length) * 100);
            return (
              <article
                key={path.id}
                className={`path-card accent-${path.accent}`}
                data-reveal
                style={{ '--delay': `${pathIndex * 60}ms` } as CSSProperties}
              >
                <header className="path-card__head">
                  <div>
                    <span className="path-card__role">{path.role}</span>
                    <h3>{path.title}</h3>
                  </div>
                  <div
                    className="progress-ring"
                    style={{ '--p': `${percent * 3.6}deg` } as CSSProperties}
                    aria-label={`${percent}% completado`}
                    role="img"
                  >
                    <span>{percent}%</span>
                  </div>
                </header>
                <p className="path-card__desc">{path.description}</p>

                <ol className="path-steps">
                  {path.steps.map((step, index) => {
                    const command = COMMAND_BY_ID.get(step.commandId);
                    if (!command) return null;
                    const done = completed.includes(step.commandId);
                    return (
                      <li key={`${path.id}-${step.commandId}-${index}`} className={cn('path-step', done && 'is-done')}>
                        <button
                          type="button"
                          className="path-step__check"
                          onClick={() => toggleStep(path.id, step.commandId)}
                          aria-label={done ? `Marcar ${step.title} como pendiente` : `Marcar ${step.title} como completado`}
                          aria-pressed={done}
                        >
                          {done ? <Check size={12} /> : String(index + 1).padStart(2, '0')}
                        </button>
                        <div className="path-step__body">
                          <span className="path-step__title">{step.title}</span>
                          <span className="path-step__why">{step.why}</span>
                          <button
                            type="button"
                            className="path-step__command"
                            onClick={() => onOpenCommand(command.id)}
                          >
                            <CategoryIcon categoryId={command.category} size={11} />
                            <code>{command.name}</code>
                            <ArrowUpRight size={11} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <footer className="path-card__footer">
                  <span>
                    {completed.length}/{path.steps.length} pasos completados
                  </span>
                  {completed.length > 0 && (
                    <button type="button" onClick={() => resetPath(path.id)}>
                      <RotateCcw size={11} aria-hidden="true" /> Reiniciar
                    </button>
                  )}
                </footer>
              </article>
            );
          })}
        </div>

        <p className="paths__note" data-reveal>
          El progreso es local: no hay cuenta, no hay servidor, no hay cookies. Si borras los datos
          del navegador, se reinicia.
        </p>
      </div>
    </section>
  );
}
