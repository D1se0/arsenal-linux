import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Code2,
  Search,
  Terminal,
  X,
} from 'lucide-react';
import {
  SCRIPT_MANUALS,
  SCRIPT_MANUAL_BY_ID,
  SCRIPT_ROLES,
  SCRIPT_STATS,
  type ScriptLanguage,
  type ScriptRole,
  type ScriptTopic,
} from '../data/scripting';
import { dedentCode, tokenizeCode } from '../lib/highlight';
import { cn, ROLE_META } from '../lib/utils';
import { CopyButton, RoleBadge, SectionHead } from './ui';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code className="inline-code" key={`${part}-${index}`}>
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function CodeBlock({
  code,
  language,
  label,
  output,
}: {
  code: string;
  language: ScriptLanguage;
  label?: string;
  output?: string;
}) {
  const clean = dedentCode(code);
  const tokens = useMemo(() => tokenizeCode(clean, language), [clean, language]);

  return (
    <div className="snippet">
      <div className="snippet__bar">
        <span className="snippet__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="snippet__label">{label ?? (language === 'bash' ? 'bash' : 'python3')}</span>
        <CopyButton value={clean} compact label="Copiar bloque de código" />
      </div>
      <pre className="snippet__pre" tabIndex={0}>
        <code>
          {tokens.map((token, index) => (
            <span className={`token token--${token.type}`} key={index}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
      {output && (
        <div className="snippet__output">
          <span>salida</span>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}

function TopicCard({ topic, language, chapter }: { topic: ScriptTopic; language: ScriptLanguage; chapter: string }) {
  return (
    <article className="topic-card" id={`scripting-${language}-${topic.id}`}>
      <header className="topic-card__head">
        <div className="topic-card__meta">
          <span className="topic-card__chapter">{chapter}</span>
          <RoleBadge role={topic.role} />
          <span className={`script-level script-level--${topic.level}`}>{topic.level}</span>
        </div>
        <h4>{topic.title}</h4>
        <p>
          <RichText text={topic.summary} />
        </p>
      </header>

      <div className="syntax-line">
        <span>sintaxis</span>
        <code>{topic.syntax}</code>
      </div>

      <div className="topic-card__grid">
        <CodeBlock code={topic.code} language={language} output={topic.output} />
        <div className="topic-card__notes">
          <p className="topic-card__notes-label">Qué tienes que saber</p>
          <ul>
            {topic.points.map((point) => (
              <li key={point}>
                <ChevronRight size={13} aria-hidden="true" />
                <span>
                  <RichText text={point} />
                </span>
              </li>
            ))}
          </ul>
          {topic.gotcha && (
            <div className="gotcha">
              <AlertTriangle size={15} aria-hidden="true" />
              <p>
                <strong>Ojo:</strong> <RichText text={topic.gotcha} />
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function Scripting() {
  const [manualId, setManualId] = useState<ScriptLanguage>('bash');
  const [chapterId, setChapterId] = useState('fundamentos');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<ScriptRole | 'all'>('all');

  const manual = SCRIPT_MANUAL_BY_ID.get(manualId) ?? SCRIPT_MANUALS[0];
  const normalizedQuery = normalize(query.trim());
  const isSearching = normalizedQuery.length > 0;

  const filteredChapters = useMemo(
    () =>
      manual.chapters
        .map((chapter) => ({
          ...chapter,
          topics: chapter.topics.filter((topic) => {
            if (role !== 'all' && topic.role !== role) return false;
            if (!normalizedQuery) return true;
            const haystack = normalize(
              [
                topic.title,
                topic.summary,
                topic.syntax,
                topic.code,
                topic.output ?? '',
                topic.points.join(' '),
                topic.gotcha ?? '',
              ].join(' '),
            );
            return haystack.includes(normalizedQuery);
          }),
        }))
        .filter((chapter) => chapter.topics.length > 0),
    // matchesTopic changes with role/query by design; the normalized query keeps this stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manual, normalizedQuery, role],
  );

  const filteredRecipes = useMemo(
    () =>
      manual.recipes.filter((recipe) => {
        if (role !== 'all' && recipe.role !== role) return false;
        if (!normalizedQuery) return true;
        return normalize(
          [recipe.title, recipe.summary, recipe.code, recipe.tags.join(' ')].join(' '),
        ).includes(normalizedQuery);
      }),
    [manual, normalizedQuery, role],
  );

  const chapterCounts = new Map(filteredChapters.map((chapter) => [chapter.id, chapter.topics.length]));
  const selectedChapter = manual.chapters.find((chapter) => chapter.id === chapterId);
  const activeChapter = selectedChapter ?? manual.chapters[0];
  const isRecipes = chapterId === 'recetas';
  const showRecipes = isRecipes || (isSearching && filteredRecipes.length > 0);
  const visibleChapters = isSearching
    ? filteredChapters
    : isRecipes
      ? []
      : filteredChapters.filter((chapter) => chapter.id === activeChapter.id);
  const totalResults =
    filteredChapters.reduce((total, chapter) => total + chapter.topics.length, 0) + filteredRecipes.length;

  const selectLanguage = (language: ScriptLanguage) => {
    const next = SCRIPT_MANUAL_BY_ID.get(language);
    if (!next) return;
    setManualId(language);
    setChapterId(next.chapters[0].id);
    setQuery('');
    setRole('all');
  };

  const clearFilters = () => {
    setQuery('');
    setRole('all');
    setChapterId(manual.chapters[0].id);
  };

  const manualTopics = manual.chapters.reduce((total, chapter) => total + chapter.topics.length, 0);

  return (
    <section id="scripting" className={`section scripting-section accent-${manual.accent}`}>
      <div className="scripting__halo" aria-hidden="true" />
      <div className="shell">
        <SectionHead
          eyebrow="Manuales de scripting"
          title={
            <>
              Aprende el lenguaje.
              <br />
              <em>No solo la línea.</em>
            </>
          }
          description="Dos manuales completos, Bash y Python 3, pensados para construir herramientas reales. Conceptos, sintaxis, ejemplos por rol, errores típicos y buenas prácticas de producción."
        />

        <div className="scripting__masthead" data-reveal>
          <div className="scripting__languages" role="tablist" aria-label="Elige un lenguaje">
            {SCRIPT_MANUALS.map((item) => {
              const isActive = item.id === manualId;
              const Icon = item.id === 'bash' ? Terminal : Code2;
              const count = item.chapters.reduce((total, chapter) => total + chapter.topics.length, 0);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={cn('scripting-language', `accent-${item.accent}`, isActive && 'is-active')}
                  onClick={() => selectLanguage(item.id)}
                >
                  <span className="scripting-language__icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="scripting-language__copy">
                    <strong>{item.label}</strong>
                    <small>{item.version}</small>
                  </span>
                  <span className="scripting-language__count">{count} temas</span>
                </button>
              );
            })}
          </div>

          <div className="scripting__stats" aria-label="Contenido del manual">
            <span>
              <strong>{manual.chapters.length}</strong> capítulos
            </span>
            <span>
              <strong>{manualTopics}</strong> temas
            </span>
            <span>
              <strong>{manual.recipes.length}</strong> recetas por rol
            </span>
            <span>
              <strong>{SCRIPT_STATS.examples}</strong> ejemplos totales
            </span>
          </div>
        </div>

        <div className="scripting-layout">
          <aside className="scripting-nav" aria-label={`Índice de ${manual.label}`}>
            <div className="scripting-nav__sticky">
              <div className="scripting-search">
                <Search size={15} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Buscar en ${manual.label}…`}
                  aria-label={`Buscar en el manual de ${manual.label}`}
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} aria-label="Borrar búsqueda">
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="scripting-roles" role="group" aria-label="Filtrar ejemplos por rol">
                <button
                  type="button"
                  className={cn(role === 'all' && 'is-active')}
                  onClick={() => setRole('all')}
                  aria-pressed={role === 'all'}
                >
                  Todos
                </button>
                {SCRIPT_ROLES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={cn(`role-${item}`, role === item && 'is-active')}
                    onClick={() => setRole(item)}
                    aria-pressed={role === item}
                  >
                    <i aria-hidden="true" />
                    {ROLE_META[item].label}
                  </button>
                ))}
              </div>

              <div className="scripting-nav__heading">
                <BookOpen size={14} aria-hidden="true" />
                <span>Capítulos</span>
                <em>{manualTopics}</em>
              </div>

              <div className="scripting-chapters">
                {manual.chapters.map((chapter, index) => {
                  const count = chapterCounts.get(chapter.id) ?? 0;
                  const isActive = chapter.id === selectedChapter?.id && !isSearching;
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      className={cn('scripting-chapter', isActive && 'is-active', count === 0 && 'is-empty')}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => {
                        setChapterId(chapter.id);
                        setQuery('');
                      }}
                    >
                      <span className="scripting-chapter__number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="scripting-chapter__title">{chapter.title}</span>
                      <span className="scripting-chapter__count">{count}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  className={cn(
                    'scripting-chapter scripting-chapter--recipes',
                    chapterId === 'recetas' && !isSearching && 'is-active',
                    filteredRecipes.length === 0 && 'is-empty',
                  )}
                  onClick={() => {
                    setChapterId('recetas');
                    setQuery('');
                  }}
                >
                  <span className="scripting-chapter__number">R</span>
                  <span className="scripting-chapter__title">Recetas por rol</span>
                  <span className="scripting-chapter__count">{filteredRecipes.length}</span>
                </button>
              </div>

              <div className="scripting-nav__refs">
                <p>Fuentes oficiales</p>
                {manual.references.map((reference) => (
                  <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer">
                    {reference.label}
                    <ArrowUpRight size={11} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className="scripting-content">
            <div className="scripting-content__bar" aria-live="polite">
              <p>
                {isSearching || role !== 'all' ? (
                  <>
                    <strong>{totalResults}</strong> resultados
                    {role !== 'all' ? ` para ${ROLE_META[role].label}` : ''}
                  </>
                ) : (
                  <>
                    Manual de <strong>{manual.label}</strong> · {manual.headline}
                  </>
                )}
              </p>
              {(isSearching || role !== 'all') && (
                <button type="button" onClick={clearFilters}>
                  Limpiar filtros
                  <X size={13} aria-hidden="true" />
                </button>
              )}
            </div>

            {visibleChapters.map((chapter) => {
              const original = manual.chapters.find((item) => item.id === chapter.id);
              return (
                <div className="scripting-chapter-block" key={chapter.id}>
                  <header className="scripting-chapter-head">
                    <p className="eyebrow">
                      {String(manual.chapters.indexOf(original ?? chapter) + 1).padStart(2, '0')} ·{' '}
                      {chapter.topics.length} temas
                    </p>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.summary}</p>
                  </header>
                  <div className="topic-list">
                    {chapter.topics.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        language={manual.id}
                        chapter={chapter.title}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {showRecipes && filteredRecipes.length > 0 && (
              <div className="scripting-chapter-block">
                <header className="scripting-chapter-head">
                  <p className="eyebrow">Recetas · {filteredRecipes.length} ejemplos</p>
                  <h3>Scripts completos por rol</h3>
                  <p>
                    Cada receta junta varios conceptos en un caso realista. Están pensadas para adaptarlas,
                    revisarlas y ejecutarlas solo sobre sistemas autorizados.
                  </p>
                </header>
                <div className="recipe-grid">
                  {filteredRecipes.map((recipe) => (
                    <article className="recipe-card" key={recipe.id}>
                      <header>
                        <RoleBadge role={recipe.role} />
                        <h4>{recipe.title}</h4>
                        <p>{recipe.summary}</p>
                      </header>
                      <CodeBlock code={recipe.code} language={manual.id} label={`${manual.id} · receta`} />
                      <div className="recipe-card__tags">
                        {recipe.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {visibleChapters.length === 0 && !showRecipes && (
              <div className="scripting-empty">
                <Search size={26} aria-hidden="true" />
                <h3>Sin coincidencias en este capítulo</h3>
                <p>
                  Prueba con otro término, cambia el rol o vuelve a la vista completa del manual.
                </p>
                <button type="button" className="button button--ghost button--sm" onClick={clearFilters}>
                  Ver todo {manual.label}
                </button>
              </div>
            )}

            <div className="scripting-footnote">
              <span aria-hidden="true">!</span>
              <p>
                Los ejemplos son material didáctico. No automatizan ataques ni garantizan compatibilidad con
                todas las versiones. Revisa el código, los permisos y el alcance antes de ejecutarlo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
