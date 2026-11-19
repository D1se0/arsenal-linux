import { useCallback, useEffect, useState } from 'react';
import { COMMAND_BY_ID } from './data/commands';
import { useLocalStorage, useReveal, useTheme } from './hooks';
import { BackToTop, Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Explorer } from './components/Explorer';
import { Builder } from './components/Builder';
import { Tactics } from './components/Tactics';
import { Paths } from './components/Paths';
import { Cheatsheets } from './components/Cheatsheets';
import { Scripting } from './components/Scripting';
import { Glossary } from './components/Glossary';
import { CtaBand, Footer } from './components/Footer';
import { CommandDrawer } from './components/CommandDrawer';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  const { theme, toggle } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useLocalStorage<string[]>('arsenal-favorites', []);
  useReveal();

  const selectedCommand = selectedId ? COMMAND_BY_ID.get(selectedId) ?? null : null;

  const openCommand = useCallback((id: string) => {
    if (!COMMAND_BY_ID.has(id)) return;
    const url = new URL(window.location.href);
    url.searchParams.set('cmd', id);
    window.history.pushState({ cmd: id }, '', url);
    setSelectedId(id);
    setPaletteOpen(false);
  }, []);

  const closeCommand = useCallback(() => {
    setSelectedId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('cmd');
    window.history.replaceState({}, '', url);
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('cmd');
    if (id && COMMAND_BY_ID.has(id)) setSelectedId(id);

    const onPopState = () => {
      const current = new URLSearchParams(window.location.search).get('cmd');
      setSelectedId(current && COMMAND_BY_ID.has(current) ? current : null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        setPaletteOpen((value) => !value);
        return;
      }
      if (event.key === '/' && !paletteOpen) {
        const tag = (document.activeElement as HTMLElement | null)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          event.preventDefault();
          setPaletteOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [paletteOpen]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
    },
    [setFavorites],
  );

  const exploreSearch = useCallback((value: string) => {
    setQuery(value);
    setPaletteOpen(false);
    window.setTimeout(() => {
      document.getElementById('arsenal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }, []);

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Nav theme={theme} onToggleTheme={toggle} onOpenPalette={() => setPaletteOpen(true)} />

      <main id="contenido">
        <Hero onOpenCommand={openCommand} onOpenPalette={() => setPaletteOpen(true)} />
        <Explorer
          query={query}
          onQueryChange={setQuery}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpenCommand={openCommand}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <Builder onOpenCommand={openCommand} />
        <Tactics onSearch={exploreSearch} />
        <Paths onOpenCommand={openCommand} />
        <Cheatsheets />
        <Scripting />
        <Glossary />
        <CtaBand onOpenPalette={() => setPaletteOpen(true)} />
      </main>

      <Footer />
      <BackToTop />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={openCommand}
        onShowAll={exploreSearch}
      />

      <CommandDrawer
        command={selectedCommand}
        onClose={closeCommand}
        onOpenCommand={openCommand}
        favorite={selectedCommand ? favorites.includes(selectedCommand.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </>
  );
}
