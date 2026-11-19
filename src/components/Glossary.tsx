import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS, GLOSSARY } from '../data/site';
import { SectionHead } from './ui';

export function Glossary() {
  return (
    <section id="glosario" className="section glossary-section">
      <div className="shell">
        <SectionHead
          eyebrow="Glosario y dudas"
          title={
            <>
              El vocabulario
              <br />
              <em>importa.</em>
            </>
          }
          description="Las palabras que aparecen una y otra vez en informes, mesas de crisis y conversaciones de equipo. Definiciones cortas, sin humo."
        />

        <div className="glossary-layout">
          <div className="glossary" data-reveal>
            <p className="eyebrow">Términos clave</p>
            {GLOSSARY.map((item, index) => (
              <details className="glossary__item" key={item.term}>
                <summary>
                  <span className="glossary__index">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item.term}</span>
                  <ChevronDown size={15} className="glossary__chevron" aria-hidden="true" />
                </summary>
                <p>{item.definition}</p>
              </details>
            ))}
          </div>

          <div className="faq" id="glosario-faq">
            <p className="eyebrow">
              <HelpCircle size={13} aria-hidden="true" /> Preguntas frecuentes
            </p>
            {FAQS.map((item) => (
              <details className="faq__item" key={item.question}>
                <summary>
                  {item.question}
                  <ChevronDown size={15} className="glossary__chevron" aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
            <div className="faq__note">
              <span aria-hidden="true">!</span>
              <p>
                Esta web documenta comandos de seguridad. No autoriza su uso sobre sistemas ajenos.
                La legalidad empieza por el permiso escrito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
