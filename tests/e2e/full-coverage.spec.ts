import { expect, test, type Page } from '@playwright/test';
import { CATEGORIES } from '../../src/data/categories';
import {
  COMMANDS,
  COMMAND_BY_ID,
  COMMAND_STATS,
  CATEGORY_COUNTS,
  ROLE_COUNTS,
} from '../../src/data/commands';
import { CHEATSHEETS, FAQS, GLOSSARY, LEARNING_PATHS } from '../../src/data/site';
import { ROLES } from '../../src/data/types';

test.setTimeout(240_000);

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  (page as unknown as { __errors: string[] }).__errors = errors;
});

test.afterEach(async ({ page }) => {
  const errors = (page as unknown as { __errors?: string[] }).__errors ?? [];
  expect(errors, `Errores de consola:\n${errors.join('\n')}`).toEqual([]);
});

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function openCommandById(page: Page, id: string) {
  await page.evaluate((commandId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('cmd', commandId);
    window.history.pushState({ cmd: commandId }, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, id);
}

test('abre y renderiza las 279 fichas con sus contadores', async ({ page }) => {
  await page.goto(`/?cmd=${COMMANDS[0].id}`);
  const drawer = page.getByRole('dialog');
  await expect(drawer).toBeVisible();

  for (const command of COMMANDS) {
    await openCommandById(page, command.id);
    await expect(drawer.locator('#command-title'), `Título de ${command.id}`).toContainText(command.name);
    await expect(drawer.locator('.drawer__summary'), `Resumen de ${command.id}`).toHaveText(command.summary);
    await expect(drawer.locator('.dossier__text'), `Guía de ${command.id}`).toHaveText(command.description);
    await expect(drawer.locator('.drawer__tab-count'), `Contadores de ${command.id}`).toHaveText([
      String(command.params.length),
      String(command.examples.length),
    ]);
  }

  await page.getByRole('button', { name: 'Cerrar ficha' }).click();
  await expect(drawer).toBeHidden();
});

test('recorre las seis rutas y abre sus 42 comandos', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.path-card');
  await expect(cards).toHaveCount(LEARNING_PATHS.length);

  for (const path of LEARNING_PATHS) {
    const card = cards.filter({ hasText: path.title }).first();
    await expect(card, `Ruta ${path.id}`).toBeVisible();
    const buttons = card.locator('.path-step__command');
    await expect(buttons, `Pasos de ${path.id}`).toHaveCount(path.steps.length);

    for (const [index, step] of path.steps.entries()) {
      const command = COMMAND_BY_ID.get(step.commandId);
      expect(command, `${path.id} -> ${step.commandId}`).toBeTruthy();
      await buttons.nth(index).click();
      await expect(page.locator('#command-title'), `${path.id}/${step.commandId}`).toContainText(command!.name);
      await page.getByRole('button', { name: 'Cerrar ficha' }).click();
      await expect(page.getByRole('dialog')).toBeHidden();
    }
  }
});

test('recorre las siete chuletas y sus 64 entradas', async ({ page }) => {
  await page.goto('/');
  const tabs = page.locator('.cheatsheets__tabs');
  await expect(tabs.getByRole('tab')).toHaveCount(CHEATSHEETS.length);

  for (const sheet of CHEATSHEETS) {
    await tabs.getByRole('tab', { name: new RegExp(`^${escapeRegex(sheet.label)}`) }).click();
    await expect(page.locator('.cheatsheets__panel h3')).toHaveText(sheet.title);
    await expect(page.locator('.cheat')).toHaveCount(sheet.items.length);
    await expect(page.locator('.cheat__code')).toHaveText(sheet.items.map((item) => item.code));
  }
});

test('abre los 22 términos del glosario y las 8 FAQ', async ({ page }) => {
  await page.goto('/');
  const glossary = page.locator('.glossary__item');
  const faq = page.locator('.faq__item');
  await expect(glossary).toHaveCount(GLOSSARY.length);
  await expect(faq).toHaveCount(FAQS.length);

  for (let index = 0; index < GLOSSARY.length; index += 1) {
    const item = glossary.nth(index);
    await item.locator('summary').click();
    await expect(item, GLOSSARY[index].term).toHaveAttribute('open', '');
    await expect(item.locator('p')).toHaveText(GLOSSARY[index].definition);
  }

  for (let index = 0; index < FAQS.length; index += 1) {
    const item = faq.nth(index);
    await item.locator('summary').click();
    await expect(item, FAQS[index].question).toHaveAttribute('open', '');
    await expect(item.locator('p')).toHaveText(FAQS[index].answer);
  }
});

test('los filtros coinciden con el catálogo completo', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile';
  await page.goto('/');
  if (mobile) await page.getByRole('button', { name: /^Filtros/ }).click();

  const filters = page.locator('#explorer-filters');
  const summary = page.locator('.explorer__summary p strong');
  const cards = page.locator('.cmd-card');

  const check = async (button: ReturnType<typeof filters.getByRole>, expected: number, label: string) => {
    await button.click();
    await expect(summary, label).toHaveText(String(expected));
    await expect(cards, label).toHaveCount(Math.min(18, expected));
    await button.click();
    await expect(summary, `${label} (reset)`).toHaveText(String(COMMAND_STATS.commands));
  };

  const categoriesGroup = filters.locator('.filter-list');
  for (const category of CATEGORIES) {
    const button = categoriesGroup.getByRole('button', { name: new RegExp(`^${escapeRegex(category.label)}`) });
    await check(button, CATEGORY_COUNTS[category.id], `Categoría ${category.label}`);
  }

  const rolesGroup = filters.locator('.filter-pills').nth(0);
  for (const role of ROLES) {
    const button = rolesGroup.getByRole('button', { name: new RegExp(`^${escapeRegex(role.label)}`) });
    await check(button, ROLE_COUNTS[role.id], `Rol ${role.label}`);
  }

  const levelsGroup = filters.locator('.filter-pills--compact').nth(0);
  const difficultyLabels = ['inicial', 'intermedio', 'avanzado'] as const;
  for (const difficulty of difficultyLabels) {
    const count = COMMANDS.filter((command) => command.difficulty === difficulty).length;
    await check(levelsGroup.getByRole('button', { name: difficulty }), count, `Dificultad ${difficulty}`);
  }

  const dangersGroup = filters.locator('.filter-pills--compact').nth(1);
  const dangerLabels = ['bajo', 'medio', 'alto', 'critico'] as const;
  for (const danger of dangerLabels) {
    const count = COMMANDS.filter((command) => command.danger === danger).length;
    await check(dangersGroup.getByRole('button', { name: danger }), count, `Riesgo ${danger}`);
  }

  if (mobile) await filters.getByRole('button', { name: 'Cerrar filtros' }).click();
});

test('la paginación llega a las 279 tarjetas y cambia de vista', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.cmd-card');
  await expect(cards).toHaveCount(18);

  for (let shown = 18; shown < COMMANDS.length; shown += 18) {
    await page.getByRole('button', { name: /Mostrar .* más/ }).click();
    await expect(cards).toHaveCount(Math.min(shown + 18, COMMANDS.length));
  }

  await page.getByRole('button', { name: 'Vista de lista' }).click();
  await expect(page.locator('.command-grid')).toHaveClass(/command-grid--list/);
  await page.getByRole('button', { name: 'Vista de tarjetas' }).click();
  await expect(page.locator('.command-grid')).not.toHaveClass(/command-grid--list/);
});

test('sin overflow ni controles sin nombre en 320, 375, 768 y 1440 px', async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const report = await page.evaluate(() => {
      const unnamedButtons = [...document.querySelectorAll('button')].filter((element) => {
        const text = element.textContent?.trim();
        return !text && !element.getAttribute('aria-label') && !element.getAttribute('title');
      }).length;

      const unnamedLinks = [...document.querySelectorAll('a')].filter((element) => {
        const text = element.textContent?.trim();
        return !text && !element.getAttribute('aria-label') && !element.getAttribute('title');
      }).length;

      const unnamedControls = [...document.querySelectorAll('input, select, textarea')].filter((element) => {
        const labels = (element as HTMLInputElement).labels;
        return (
          !element.getAttribute('aria-label') &&
          !element.getAttribute('aria-labelledby') &&
          !element.getAttribute('title') &&
          !(labels && labels.length)
        );
      }).length;

      const allIds = [...document.querySelectorAll('[id]')].map((element) => element.id);
      const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
      const imagesWithoutAlt = [...document.querySelectorAll('img')].filter((image) => !image.hasAttribute('alt')).length;

      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        unnamedButtons,
        unnamedLinks,
        unnamedControls,
        duplicateIds: [...new Set(duplicateIds)],
        imagesWithoutAlt,
      };
    });

    expect(report.overflow, `Overflow a ${width}px`).toBeLessThanOrEqual(1);
    expect(report.unnamedButtons, `Botones sin nombre a ${width}px`).toBe(0);
    expect(report.unnamedLinks, `Enlaces sin nombre a ${width}px`).toBe(0);
    expect(report.unnamedControls, `Controles sin etiqueta a ${width}px`).toBe(0);
    expect(report.duplicateIds, `IDs duplicados a ${width}px`).toEqual([]);
    expect(report.imagesWithoutAlt, `Imágenes sin alt a ${width}px`).toBe(0);
  }
});
