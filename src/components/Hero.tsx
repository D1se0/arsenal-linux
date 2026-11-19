import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { COMMANDS, COMMAND_STATS } from '../data/commands';
import { CATEGORY_BY_ID } from '../data/categories';
import type { Command } from '../data/types';
import { useReducedMotion } from '../hooks';
import { cn } from '../lib/utils';
import { CategoryIcon, CountUp } from './ui';

const DEMOS = [
  {
    command: 'nmap -sV -sC -p- 10.10.10.5',
    lines: [
      'PORT     STATE  SERVICE   VERSION',
      '22/tcp   open   ssh       OpenSSH 8.9p1',
      '80/tcp   open   http      nginx 1.24.0',
      '443/tcp  open   ssl/http  nginx 1.24.0',
    ],
    meta: 'DISCOVERY · 3 SERVICIOS · 1.42s',
  },
  {
    command: 'sudo tcpdump -nn -i eth0 port 443 -w h.ttps.pcap',
    lines: [
      'listening on eth0, link-type EN10MB',
      '14:02:11.442 IP 10.10.10.5.443 > 10.10.14.2.51544',
      '14:02:11.443 IP 10.10.14.2.51544 > 10.10.10.5.443',
      '52 packets captured · 52 received',
    ],
    meta: 'BLUE TEAM · CAPTURA LIMPIA · 52 PAQUETES',
  },
  {
    command: 'ffuf -u https://demo/FUZZ -w raft.txt -ac -mc 200,403',
    lines: [
      'admin                   [Status: 403, Size: 162]',
      'api                     [Status: 200, Size: 2412]',
      'backup                  [Status: 200, Size: 8890]',
      '3 resultados · autocalibración activa',
    ],
    meta: 'HACKING WEB · 3 RUTAS · 1.08s',
  },
  {
    command: 'journalctl -u nginx -p err --since "1 hour ago"',
    lines: [
      'Nov 18 14:01:22 web01 nginx[842]: upstream timed out',
      'Nov 18 14:01:22 web01 nginx[842]: connect() failed',
      'Nov 18 14:01:25 web01 nginx[842]: 502 on /api/orders',
      '— 3 errores en la última hora',
    ],
    meta: 'SYSADMIN · 3 ERRORES · VENTANA 1H',
  },
];

function Terminal() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(reduced ? DEMOS[0].command : '');
  const [lineCount, setLineCount] = useState(reduced ? DEMOS[0].lines.length : 0);
  const demo = DEMOS[index];

  useEffect(() => {
    if (reduced) return;
    const timers: number[] = [];
    setTyped('');
    setLineCount(0);
    let position = 0;
    const type = () => {
      if (position <= demo.command.length) {
        setTyped(demo.command.slice(0, position));
        position += 1;
        timers.push(window.setTimeout(type, 34 + Math.random() * 46));
      } else {
        demo.lines.forEach((_, lineIndex) => {
          timers.push(
            window.setTimeout(() => setLineCount(lineIndex + 1), 260 + lineIndex * 190),
          );
        });
        timers.push(window.setTimeout(() => setIndex((value) => (value + 1) % DEMOS.length), 4700));
      }
    };
    timers.push(window.setTimeout(type, 620));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [demo, index, reduced]);

  return (
    <div className="terminal" aria-label="Demostración animada de comandos">
      <div className="terminal__bar">
        <span className="terminal__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="terminal__title">arsenal@linux — zsh</span>
        <span className="terminal__live">
          <i aria-hidden="true" /> LIVE
        </span>
      </div>
      <div className="terminal__body">
        <div className="terminal__line terminal__line--command">
          <span className="terminal__user">arsenal</span>
          <span className="terminal__at">@</span>
          <span className="terminal__host">linux</span>
          <span className="terminal__path">~</span>
          <span className="terminal__dollar">$</span>
          <span className="terminal__typed">{typed}</span>
          <span className={cn('terminal__cursor', reduced && 'is-static')} aria-hidden="true" />
        </div>
        <div className="terminal__output" aria-live="off">
          {demo.lines.slice(0, lineCount).map((line) => (
            <div className="terminal__line terminal__line--output" key={line}>
              <span>{line}</span>
            </div>
          ))}
        </div>
        <div className={cn('terminal__meta', lineCount === demo.lines.length && 'is-visible')}>
          <span className="terminal__meta-dot" aria-hidden="true" />
          {demo.meta}
        </div>
      </div>
      <div className="terminal__scan" aria-hidden="true" />
    </div>
  );
}

function DailyCommand({ command, onOpen }: { command: Command; onOpen: (id: string) => void }) {
  const category = CATEGORY_BY_ID[command.category];
  return (
    <button type="button" className="daily-card" onClick={() => onOpen(command.id)}>
      <span className={cn('daily-card__icon', `accent-${category.accent}`)}>
        <CategoryIcon categoryId={command.category} size={17} />
      </span>
      <span className="daily-card__body">
        <span className="daily-card__eyebrow">
          <Sparkles size={11} aria-hidden="true" /> Comando del día
        </span>
        <strong>{command.name}</strong>
        <span className="daily-card__category">{category.label}</span>
      </span>
      <ArrowUpRight size={16} className="daily-card__arrow" aria-hidden="true" />
    </button>
  );
}

export function Hero({
  onOpenCommand,
  onOpenPalette,
}: {
  onOpenCommand: (id: string) => void;
  onOpenPalette: () => void;
}) {
  const daily = useMemo(() => {
    const key = new Date().toISOString().slice(0, 10);
    const seed = Array.from(key).reduce((total, char) => total + char.charCodeAt(0), 0);
    return COMMANDS[seed % COMMANDS.length];
  }, []);

  return (
    <section id="inicio" className="hero">
      <div className="hero__noise" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__orb hero__orb--lime" aria-hidden="true" />
      <div className="hero__orb hero__orb--cyan" aria-hidden="true" />

      <div className="hero__content shell">
        <div className="hero__copy">
          <div className="eyebrow hero__eyebrow" data-reveal>
            <span className="live-dot" aria-hidden="true" />
            Base de datos abierta · Linux · {COMMAND_STATS.commands} comandos
          </div>
          <h1 data-reveal style={{ '--delay': '70ms' } as CSSProperties}>
            El arsenal{' '}
            <br />
            de comandos{' '}
            <br />
            <span className="hero__word">de Linux.</span>
          </h1>
          <p className="hero__lead" data-reveal style={{ '--delay': '150ms' } as CSSProperties}>
            De la primera consulta DNS al análisis de memoria. Cada comando explicado al detalle:
            parámetros, ejemplos reales y contexto para red team, blue team, sysadmin y redes.
          </p>
          <div className="hero__cta" data-reveal style={{ '--delay': '230ms' } as CSSProperties}>
            <a className="button button--primary" href="#arsenal">
              Explorar el arsenal
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <button type="button" className="button button--ghost" onClick={onOpenPalette}>
              <Search size={16} aria-hidden="true" />
              Búsqueda rápida
              <kbd className="kbd kbd--ghost">Ctrl K</kbd>
            </button>
          </div>
          <div className="hero__proof" data-reveal style={{ '--delay': '310ms' } as CSSProperties}>
            <span>
              <Check size={13} aria-hidden="true" /> Sin cuenta
            </span>
            <span>
              <Check size={13} aria-hidden="true" /> Sin telemetría
            </span>
            <span>
              <ShieldCheck size={13} aria-hidden="true" /> Datos locales
            </span>
          </div>
        </div>

        <div className="hero__visual" data-reveal style={{ '--delay': '180ms' } as CSSProperties}>
          <div className="hero__orbit hero__orbit--outer" aria-hidden="true" />
          <div className="hero__orbit hero__orbit--inner" aria-hidden="true" />
          <div className="hero__orbit-label" aria-hidden="true">
            READ / EXPLAIN / COPY
          </div>
          <Terminal />
          <DailyCommand command={daily} onOpen={onOpenCommand} />
          <span className="hero-chip hero-chip--a" aria-hidden="true">
            <span className="hero-chip__dot" /> MITRE · Discovery
          </span>
          <span className="hero-chip hero-chip--b" aria-hidden="true">
            <span className="hero-chip__dot hero-chip__dot--cyan" /> copy ready
          </span>
        </div>
      </div>

      <div className="hero__baseline shell">
        <a className="hero__scroll" href="#arsenal">
          <ArrowDown size={15} aria-hidden="true" />
          Baja al arsenal
        </a>
        <div className="hero__stats">
          <div className="stat" data-reveal>
            <strong>
              <CountUp value={COMMAND_STATS.commands} />
            </strong>
            <span>comandos</span>
            <small>curados y explicados</small>
          </div>
          <div className="stat" data-reveal>
            <strong>
              <CountUp value={COMMAND_STATS.categories} />
            </strong>
            <span>dominios</span>
            <small>de la terminal al cloud</small>
          </div>
          <div className="stat" data-reveal>
            <strong>
              <CountUp value={COMMAND_STATS.examples} />
            </strong>
            <span>ejemplos</span>
            <small>red, blue, admin y red</small>
          </div>
          <div className="stat" data-reveal>
            <strong>
              <CountUp value={COMMAND_STATS.parameters} />
            </strong>
            <span>flags</span>
            <small>+{COMMAND_STATS.subparameters} subopciones anidadas</small>
          </div>
        </div>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <div className="ticker__set" key={copy}>
              <span>RED TEAM</span>
              <i />
              <span>BLUE TEAM</span>
              <i />
              <span>SYSADMIN</span>
              <i />
              <span>NETWORKING</span>
              <i />
              <span>MITRE ATT&amp;CK</span>
              <i />
              <span>PARÁMETROS EXPLICADOS</span>
              <i />
              <span>100% LOCAL</span>
              <i />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
