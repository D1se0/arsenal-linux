import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp,
  Grid2X2,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_BY_ID } from '../data/categories';
import { COMMANDS, COMMAND_STATS, CATEGORY_COUNTS, ROLE_COUNTS } from '../data/commands';
import type { CategoryId, Danger, Difficulty, Role } from '../data/types';
import { DIFFICULTIES, DANGERS, ROLES } from '../data/types';
import { activeFilterCount, filterCommands, type ExplorerFilters, type SortMode } from '../lib/search';
import { cn } from '../lib/utils';
import { CommandCard } from './CommandCard';
import { Kbd } from './ui';

type ViewMode = 'grid' | 'list';

function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

const PAGE_SIZE = 18;

export function Explorer({
  query,
  onQueryChange,
  favorites,
  onToggleFavorite,
  onOpenCommand,
  onOpenPalette,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenCommand: (id: string) => void;
  onOpenPalette: () => void;
}) {
  const [categories, setCategories] = useState<CategoryId[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [dangers, setDangers] = useState<Danger[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>('relevance');
  const [view, setView] = useState<ViewMode>('grid');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const filters: ExplorerFilters = {
    query: deferredQuery,
    categories,
    roles,
    difficulties,
    dangers,
    favoritesOnly,
    favorites,
    sort,
  };

  const results = useMemo(
    () => filterCommands(COMMANDS, filters),
    // La lista de dependencias es explícita para no recalcular por cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deferredQuery, categories, roles, difficulties, dangers, favoritesOnly, favorites, sort],
  );

  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [deferredQuery, categories, roles, difficulties, dangers, favoritesOnly, sort]);

  const filterCount = activeFilterCount(filters);
  const visible = results.slice(0, limit);
  const hasCriteria = Boolean(query.trim()) || filterCount > 0;

  const clearAll = () => {
    onQueryChange('');
    setCategories([]);
    setRoles([]);
    setDifficulties([]);
    setDangers([]);
    setFavoritesOnly(false);
    setSort('relevance');
  };

  const removeCategory = (value: CategoryId) => setCategories((list) => list.filter((item) => item !== value));
  const removeRole = (value: Role) => setRoles((list) => list.filter((item) => item !== value));
  const removeDifficulty = (value: Difficulty) =>
    setDifficulties((list) => list.filter((item) => item !== value));
  const removeDanger = (value: Danger) => setDangers((list) => list.filter((item) => item !== value));

  return (
    <section id="arsenal" className="section explorer">
      <div className="shell">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">
              <span className="live-dot" aria-hidden="true" />
              El arsenal · {COMMAND_STATS.commands} comandos
            </p>
            <h2>
              Toda la terminal,
              <br />
              <em>en una búsqueda.</em>
            </h2>
          </div>
          <p className="section-head__copy">
            Busca por nombre, flag, tag o táctica. Filtra por rol, dificultad y nivel de riesgo.
            Abre cualquier ficha para leer parámetros y ejemplos reales de red team, blue team,
            sistemas y redes.
          </p>
        </div>

        <div className="explorer__toolbar" data-reveal>
          <div className="search-box">
            <Search size={18} aria-hidden="true" className="search-box__icon" />
            <input
              id="arsenal-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Busca «nmap», «kerberos», «tcpdump», «persistencia»…"
              aria-label="Buscar comandos"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                type="button"
                className="search-box__clear"
                onClick={() => onQueryChange('')}
                aria-label="Limpiar búsqueda"
              >
                <X size={15} />
              </button>
            )}
            <button type="button" className="search-box__palette" onClick={onOpenPalette} title="Búsqueda rápida">
              <Kbd>Ctrl K</Kbd>
            </button>
          </div>

          <div className="explorer__controls">
            <button
              type="button"
              className={cn('filter-toggle', filtersOpen && 'is-active')}
              onClick={() => setFiltersOpen((value) => !value)}
              aria-expanded={filtersOpen}
              aria-controls="explorer-filters"
            >
              <SlidersHorizontal size={15} aria-hidden="true" />
              Filtros
              {filterCount > 0 && <span className="filter-toggle__count">{filterCount}</span>}
            </button>
            <label className="sort-control">
              <ArrowDownUp size={14} aria-hidden="true" />
              <span className="sr-only">Ordenar por</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
                <option value="relevance">Relevancia</option>
                <option value="az">A · Z</option>
                <option value="category">Categoría</option>
                <option value="danger">Riesgo</option>
              </select>
            </label>
            <div className="view-toggle" role="group" aria-label="Vista de resultados">
              <button
                type="button"
                className={cn(view === 'grid' && 'is-active')}
                onClick={() => setView('grid')}
                aria-label="Vista de tarjetas"
                aria-pressed={view === 'grid'}
              >
                <Grid2X2 size={15} />
              </button>
              <button
                type="button"
                className={cn(view === 'list' && 'is-active')}
                onClick={() => setView('list')}
                aria-label="Vista de lista"
                aria-pressed={view === 'list'}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="explorer__layout">
          <aside
            id="explorer-filters"
            className={cn('explorer__filters', filtersOpen && 'is-open')}
            aria-label="Filtros de comandos"
          >
            <div className="filters__head">
              <p className="eyebrow">Filtrar arsenal</p>
              <button type="button" className="filters__close" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros">
                <X size={17} />
              </button>
              {hasCriteria && (
                <button type="button" className="filters__reset" onClick={clearAll}>
                  <RotateCcw size={12} aria-hidden="true" /> Limpiar
                </button>
              )}
            </div>

            <div className="filter-group">
              <div className="filter-group__head">
                <span>Dominio</span>
                <small>{COMMAND_STATS.categories}</small>
              </div>
              <div className="filter-list">
                <button
                  type="button"
                  className={cn('filter-row', categories.length === 0 && 'is-active')}
                  onClick={() => setCategories([])}
                  aria-pressed={categories.length === 0}
                >
                  <span className="filter-row__label">
                    <Sparkles size={13} aria-hidden="true" /> Todos
                  </span>
                  <span className="filter-row__count">{COMMAND_STATS.commands}</span>
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={cn('filter-row', categories.includes(category.id) && 'is-active', `accent-${category.accent}`)}
                    onClick={() => setCategories((list) => toggleInList(list, category.id))}
                    aria-pressed={categories.includes(category.id)}
                  >
                    <span className="filter-row__label">
                      <i className="filter-dot" aria-hidden="true" />
                      {category.label}
                    </span>
                    <span className="filter-row__count">{CATEGORY_COUNTS[category.id]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group__head">
                <span>Rol</span>
              </div>
              <div className="filter-pills">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={cn('filter-pill', `role--${role.id}`, roles.includes(role.id) && 'is-active')}
                    onClick={() => setRoles((list) => toggleInList(list, role.id))}
                    aria-pressed={roles.includes(role.id)}
                  >
                    <i aria-hidden="true" />
                    {role.label}
                    <small>{ROLE_COUNTS[role.id]}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group__head">
                <span>Nivel</span>
              </div>
              <div className="filter-pills filter-pills--compact">
                {DIFFICULTIES.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={cn('filter-pill', difficulties.includes(level) && 'is-active')}
                    onClick={() => setDifficulties((list) => toggleInList(list, level))}
                    aria-pressed={difficulties.includes(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group__head">
                <span>Riesgo</span>
              </div>
              <div className="filter-pills filter-pills--compact">
                {DANGERS.map((danger) => (
                  <button
                    key={danger}
                    type="button"
                    className={cn('filter-pill', `danger-filter--${danger}`, dangers.includes(danger) && 'is-active')}
                    onClick={() => setDangers((list) => toggleInList(list, danger))}
                    aria-pressed={dangers.includes(danger)}
                  >
                    {danger}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={cn('favorites-toggle', favoritesOnly && 'is-active')}
              onClick={() => setFavoritesOnly((value) => !value)}
              aria-pressed={favoritesOnly}
            >
              <Star size={15} fill={favoritesOnly ? 'currentColor' : 'none'} aria-hidden="true" />
              Solo favoritos
              <span>{favorites.length}</span>
            </button>

            <p className="filters__note">
              Consejo: combina <strong>rol</strong> + <strong>riesgo</strong> para preparar una sesión
              de laboratorio o una revisión defensiva.
            </p>
          </aside>

          <div className="explorer__main">
            <div className="explorer__summary">
              <p>
                <strong>{results.length}</strong> {results.length === 1 ? 'comando' : 'comandos'}
                {hasCriteria ? ' encontrados' : ' en total'}
                {results.length > visible.length && (
                  <span className="explorer__summary-more"> · mostrando {visible.length}</span>
                )}
              </p>
              {hasCriteria && (
                <button type="button" className="explorer__clear" onClick={clearAll}>
                  <RotateCcw size={12} aria-hidden="true" /> Reset
                </button>
              )}
            </div>

            {hasCriteria && (
              <div className="active-filters" aria-label="Filtros activos">
                {query.trim() && (
                  <button type="button" className="active-filter" onClick={() => onQueryChange('')}>
                    «{query.trim()}» <X size={11} aria-hidden="true" />
                  </button>
                )}
                {categories.map((id) => (
                  <button key={id} type="button" className="active-filter" onClick={() => removeCategory(id)}>
                    {CATEGORY_BY_ID[id].label} <X size={11} aria-hidden="true" />
                  </button>
                ))}
                {roles.map((role) => (
                  <button key={role} type="button" className="active-filter" onClick={() => removeRole(role)}>
                    {ROLES.find((item) => item.id === role)?.label} <X size={11} aria-hidden="true" />
                  </button>
                ))}
                {difficulties.map((level) => (
                  <button key={level} type="button" className="active-filter" onClick={() => removeDifficulty(level)}>
                    {level} <X size={11} aria-hidden="true" />
                  </button>
                ))}
                {dangers.map((danger) => (
                  <button key={danger} type="button" className="active-filter" onClick={() => removeDanger(danger)}>
                    {danger} <X size={11} aria-hidden="true" />
                  </button>
                ))}
                {favoritesOnly && (
                  <button type="button" className="active-filter" onClick={() => setFavoritesOnly(false)}>
                    Favoritos <X size={11} aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            {visible.length > 0 ? (
              <div className={cn('command-grid', view === 'list' && 'command-grid--list')}>
                {visible.map((command, index) => (
                  <CommandCard
                    key={command.id}
                    command={command}
                    favorite={favorites.includes(command.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpen={onOpenCommand}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon">
                  <Search size={26} aria-hidden="true" />
                </span>
                <h3>Sin resultados con estos filtros.</h3>
                <p>
                  Prueba con un nombre de comando, una flag concreta como <code>-sV</code> o un tag
                  como <code>kerberos</code>. También puedes limpiar los filtros.
                </p>
                <button type="button" className="button button--primary" onClick={clearAll}>
                  <RotateCcw size={15} aria-hidden="true" /> Limpiar búsqueda y filtros
                </button>
              </div>
            )}

            {results.length > visible.length && (
              <div className="load-more">
                <button type="button" className="button button--ghost" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
                  Mostrar {Math.min(PAGE_SIZE, results.length - visible.length)} más
                  <span className="load-more__count">{results.length - visible.length}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
