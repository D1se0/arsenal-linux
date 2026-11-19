import { ArrowUpRight, Search, ShieldCheck, Terminal } from 'lucide-react';
import { COMMAND_STATS } from '../data/commands';
import { Logo } from './Nav';

export function CtaBand({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <section className="cta-band shell" data-reveal>
      <div className="cta-band__glow" aria-hidden="true" />
      <p className="eyebrow">
        <span className="live-dot" aria-hidden="true" />
        Tu próximo comando
      </p>
      <h2>
        Menos adivinar.
        <br />
        <em>Más entender.</em>
      </h2>
      <p>
        {COMMAND_STATS.commands} comandos, {COMMAND_STATS.examples} ejemplos y una búsqueda que
        responde en milisegundos. Todo ocurre en tu navegador.
      </p>
      <div className="cta-band__actions">
        <button type="button" className="button button--primary" onClick={onOpenPalette}>
          <Search size={16} aria-hidden="true" />
          Abrir búsqueda
          <kbd className="kbd kbd--dark">Ctrl K</kbd>
        </button>
        <a className="button button--ghost" href="#arsenal">
          Recorrer la base
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top shell">
        <div className="footer__brand">
          <Logo />
          <p>
            La base de datos de comandos que querías tener siempre abierta.
            <br />
            Documentación, no ejecución.
          </p>
          <span className="footer__badge">
            <ShieldCheck size={14} aria-hidden="true" /> 100% estático · sin tracking
          </span>
        </div>
        <div className="footer__links">
          <div>
            <p className="footer__label">Explorar</p>
            <a href="#arsenal">Arsenal</a>
            <a href="#constructor">Constructor</a>
            <a href="#rutas">Rutas de aprendizaje</a>
            <a href="#tacticas">Tácticas MITRE</a>
          </div>
          <div>
            <p className="footer__label">Referencia</p>
            <a href="#chuleta">Chuletas rápidas</a>
            <a href="#scripting">Manuales Bash y Python</a>
            <a href="#glosario">Glosario</a>
            <a href="#glosario-faq">Preguntas frecuentes</a>
          </div>
          <div>
            <p className="footer__label">Proyecto</p>
            <a href="https://pages.github.com/" target="_blank" rel="noreferrer">
              GitHub Pages <ArrowUpRight size={12} aria-hidden="true" />
            </a>
            <a href="https://vite.dev/" target="_blank" rel="noreferrer">
              Vite <ArrowUpRight size={12} aria-hidden="true" />
            </a>
            <a href="https://react.dev/" target="_blank" rel="noreferrer">
              React <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer__bottom shell">
        <span>© {new Date().getFullYear()} Arsenal Linux · Hecho para la terminal.</span>
        <span className="footer__status">
          <Terminal size={13} aria-hidden="true" /> Usa estos comandos solo con autorización.
        </span>
      </div>
    </footer>
  );
}
