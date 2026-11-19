import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { CATEGORY_COUNTS, COMMAND_STATS, TACTIC_COUNTS } from '../data/commands';
import { TACTICS } from '../data/types';
import { SectionHead, CategoryIcon } from './ui';

export function Tactics({ onSearch }: { onSearch: (query: string) => void }) {
  const max = Math.max(...Object.values(TACTIC_COUNTS), 1);

  return (
    <section id="tacticas" className="section tactics-section">
      <div className="shell">
        <SectionHead
          eyebrow="Mapa del arsenal"
          title={
            <>
              Trece dominios.
              <br />
              <em>Una sola terminal.</em>
            </>
          }
          description="Cada comando vive en un dominio y cubre una o varias fases de un ataque o de una defensa. Pulsa cualquier bloque para buscar sus comandos al instante."
        />

        <div className="category-grid">
          {CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              type="button"
              className={`category-card accent-${category.accent}`}
              onClick={() => onSearch(category.label)}
              data-reveal
              style={{ '--delay': `${index * 35}ms` } as CSSProperties}
            >
              <span className="category-card__top">
                <span className="category-card__icon">
                  <CategoryIcon categoryId={category.id} size={19} />
                </span>
                <span className="category-card__count">{CATEGORY_COUNTS[category.id]}</span>
              </span>
              <strong>{category.label}</strong>
              <p>{category.description}</p>
              <span className="category-card__link">
                Explorar <ArrowUpRight size={12} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>

        <div className="tactics" data-reveal>
          <div className="tactics__head">
            <div>
              <p className="eyebrow">
                <span className="live-dot" aria-hidden="true" /> MITRE ATT&amp;CK
              </p>
              <h3>Cobertura por táctica</h3>
            </div>
            <p>
              {COMMAND_STATS.tactics} tácticas representadas. Pulsa una barra para ver qué
              herramientas de la base encajan en esa fase.
            </p>
          </div>
          <div className="tactics__grid">
            {TACTICS.filter((tactic) => TACTIC_COUNTS[tactic]).map((tactic) => {
              const count = TACTIC_COUNTS[tactic] ?? 0;
              return (
                <button
                  key={tactic}
                  type="button"
                  className="tactic-row"
                  onClick={() => onSearch(tactic)}
                >
                  <span className="tactic-row__label">{tactic}</span>
                  <span className="tactic-row__bar">
                    <i style={{ width: `${Math.max(8, (count / max) * 100)}%` }} />
                  </span>
                  <span className="tactic-row__count">{count}</span>
                </button>
              );
            })}
          </div>
          <p className="tactics__footnote">
            Una misma herramienta puede cubrir varias fases: ofensiva, auditoría o respuesta. El
            contexto y la autorización definen su uso, no el comando.
          </p>
        </div>
      </div>
    </section>
  );
}
