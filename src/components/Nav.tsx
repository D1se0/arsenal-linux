import { useEffect, useState } from 'react';
import { Command, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { NAV_LINKS } from '../data/site';
import { useBodyLock, useScrollProgress, useScrolled, useScrollSpy, type Theme } from '../hooks';
import { cn } from '../lib/utils';
import { Kbd } from './ui';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={cn('brand', compact && 'brand--compact')}>
      <span className="brand__mark" aria-hidden="true">
        <Command size={19} strokeWidth={2.1} />
      </span>
      <span className="brand__text">
        Arsenal<b>Linux</b>
      </span>
    </span>
  );
}

export function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

export function Nav({
  theme,
  onToggleTheme,
  onOpenPalette,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
}) {
  const scrolled = useScrolled();
  const active = useScrollSpy(['inicio', ...NAV_LINKS.map((link) => link.id)]);
  const [open, setOpen] = useState(false);
  useBodyLock(open);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header className={cn('nav', scrolled && 'nav--scrolled')}>
        <a className="nav__brand" href="#inicio" aria-label="Arsenal Linux, inicio">
          <Logo />
        </a>

        <nav className="nav__links" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? 'is-active' : undefined}
              aria-current={active === link.id ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button type="button" className="nav__search" onClick={onOpenPalette} aria-label="Abrir búsqueda rápida">
            <Search size={15} aria-hidden="true" />
            <span>Buscar</span>
            <Kbd>Ctrl K</Kbd>
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
            title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            type="button"
            className="icon-button nav__burger"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={cn('mobile-menu', open && 'is-open')} aria-hidden={!open}>
        <div className="mobile-menu__inner">
          <p className="eyebrow">Mapa del arsenal</p>
          {NAV_LINKS.map((link, index) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>
              {link.label}
              <span className="mobile-menu__arrow" aria-hidden="true">↗</span>
            </a>
          ))}
          <button
            type="button"
            className="mobile-menu__search"
            onClick={() => {
              setOpen(false);
              onOpenPalette();
            }}
          >
            <Search size={17} />
            Buscar en la base de datos
            <Kbd>Ctrl K</Kbd>
          </button>
          <button type="button" className="mobile-menu__theme" onClick={onToggleTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            {theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          </button>
        </div>
      </div>
    </>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 1100);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <a
      href="#inicio"
      className={cn('to-top', visible && 'is-visible')}
      aria-label="Volver al inicio"
      tabIndex={visible ? 0 : -1}
    >
      ↑
    </a>
  );
}
