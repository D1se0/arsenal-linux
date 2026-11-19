import { useCallback, useEffect, useRef, useState } from 'react';
import { copyToClipboard } from './lib/utils';

export type Theme = 'dark' | 'light';

const THEME_KEY = 'arsenal-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'dark';
    const current = document.documentElement.dataset.theme;
    return current === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', theme === 'dark' ? '#070a08' : '#f2f0e6');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* Almacenamiento no disponible */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((value) => (value === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'));
    if (!elements.length) return;
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useScrolled(threshold = 16) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);
  return scrolled;
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return progress;
}

export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-25% 0px -62% 0px', threshold: [0.01, 0.15, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Almacenamiento no disponible */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const copy = useCallback(
    async (value: string, key = 'default') => {
      const success = await copyToClipboard(value);
      if (!success) return false;
      setCopied(key);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), timeout);
      return true;
    },
    [timeout],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { copied, copy };
}

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

export function useCountUp(target: number, duration = 1300) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, target]);

  return value;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
}
