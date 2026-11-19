import { useState } from 'react';
import { CHEATSHEETS } from '../data/site';
import { cn } from '../lib/utils';
import { CopyButton, SectionHead } from './ui';

export function Cheatsheets() {
  const [activeId, setActiveId] = useState(CHEATSHEETS[0].id);
  const sheet = CHEATSHEETS.find((item) => item.id === activeId) ?? CHEATSHEETS[0];

  return (
    <section id="chuleta" className="section cheatsheets-section">
      <div className="shell">
        <SectionHead
          eyebrow="Chuleta rápida"
          title={
            <>
              Lo que siempre
              <br />
              <em>acabas buscando.</em>
            </>
          }
          description="Los operadores, permisos y diagnósticos que se olvidan entre proyecto y proyecto. Copia la línea y sigue trabajando."
        />

        <div className="cheatsheets" data-reveal>
          <div className="cheatsheets__tabs" role="tablist" aria-label="Chuletas">
            {CHEATSHEETS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === activeId}
                className={cn(item.id === activeId && 'is-active')}
                onClick={() => setActiveId(item.id)}
              >
                {item.label}
                <span>{item.items.length}</span>
              </button>
            ))}
          </div>

          <div className="cheatsheets__panel" role="tabpanel" aria-label={sheet.title}>
            <div className="cheatsheets__head">
              <h3>{sheet.title}</h3>
              <p>{sheet.description}</p>
            </div>
            <div className="cheat-grid">
              {sheet.items.map((item) => (
                <article className="cheat" key={item.label}>
                  <div className="cheat__head">
                    <strong>{item.label}</strong>
                    <CopyButton value={item.code} compact label={`Copiar ${item.label}`} />
                  </div>
                  <code className="cheat__code">{item.code}</code>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
