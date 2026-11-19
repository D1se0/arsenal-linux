import { expect, test } from '@playwright/test';
import { COMMAND_STATS } from '../../src/data/commands';
import { BASH_MANUAL, PYTHON_MANUAL } from '../../src/data/scripting';

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

test('carga la home y muestra el arsenal', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('El arsenal');
  await expect(page.getByRole('heading', { name: /Toda la terminal/i })).toBeVisible();
  await expect(page.getByText(String(COMMAND_STATS.commands)).first()).toBeVisible();
  await expect(page.locator('.cmd-card').first()).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('la navegación por anclas deja la sección bajo la cabecera', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await page.locator('#mobile-menu').getByRole('link', { name: 'Constructor' }).click();
  } else {
    await page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('link', { name: 'Constructor' })
      .click();
  }
  await expect(page).toHaveURL(/#constructor/);
  await expect
    .poll(() => page.locator('#constructor').evaluate((element) => element.getBoundingClientRect().top))
    .toBeGreaterThanOrEqual(60);
});

test('busca nmap, abre el dossier y consulta parámetros', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Buscar comandos' });
  await search.fill('nmap');
  await expect(page.getByRole('button', { name: 'Abrir ficha de nmap' })).toBeVisible();

  await page.getByRole('button', { name: 'Abrir ficha de nmap' }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('heading', { name: /^nmap$/i })).toBeVisible();
  await expect(page).toHaveURL(/\?cmd=nmap/);

  await drawer.getByRole('button', { name: /Parámetros/ }).click();
  await expect(drawer.getByText('Escaneo SYN semiautomático y sigiloso. Requiere privilegios de root.')).toBeVisible();

  await drawer.getByRole('button', { name: /Ejemplos/ }).click();
  await expect(drawer.getByText('Descubrir hosts vivos en una subred')).toBeVisible();

  await drawer.getByRole('button', { name: 'Cerrar ficha' }).click();
  await expect(drawer).toBeHidden();
  await expect(page).not.toHaveURL(/cmd=/);
});

test('despliega subopciones explicadas dentro de un parámetro', async ({ page }) => {
  await page.goto('/?cmd=nmap');
  const drawer = page.getByRole('dialog');
  await drawer.getByRole('button', { name: /Parámetros/ }).click();

  const scripts = drawer.locator('.param-options summary').filter({ hasText: '--script' });
  await expect(scripts).toContainText('20');
  await scripts.click();
  await expect(drawer.getByText('http-enum', { exact: true })).toBeVisible();
  await expect(drawer.getByText(/Enumera rutas y paneles web habituales/i)).toBeVisible();

  await page.goto('/?cmd=john');
  const johnDrawer = page.getByRole('dialog');
  await johnDrawer.getByRole('button', { name: /Parámetros/ }).click();
  const formats = johnDrawer.locator('.param-options summary').filter({ hasText: '--format' });
  await expect(formats).toContainText('14');
  await formats.click();
  await expect(johnDrawer.getByText('raw-sha256', { exact: true })).toBeVisible();
  await expect(johnDrawer.getByText(/SHA-256 sin sal, habitual en aplicaciones/i)).toBeVisible();
});

test('paleta Ctrl+K y búsqueda por tag', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const palette = page.getByRole('dialog', { name: 'Búsqueda rápida de comandos' });
  await expect(palette).toBeVisible();
  await palette.getByRole('textbox', { name: 'Buscar comandos' }).fill('kerberos');
  await expect(palette.getByRole('option').first()).toBeVisible();
  await palette.getByRole('option', { name: /impacket-GetUserSPNs/i }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: /^impacket-GetUserSPNs$/i })).toBeVisible();
});

test('filtros por categoría y favoritos', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile';
  await page.goto('/');
  const filters = page.locator('#explorer-filters');
  if (mobile) {
    await page.getByRole('button', { name: /^Filtros/ }).click();
    await expect(filters).toHaveClass(/is-open/);
  }
  await filters.getByRole('button', { name: /^Hacking web/ }).click();
  await expect(page.locator('.cmd-card').first()).toBeVisible();
  const count = await page.locator('.cmd-card').count();
  expect(count).toBeGreaterThan(0);
  await expect(page.locator('.explorer__summary')).toContainText('encontrados');

  if (mobile) {
    await filters.getByRole('button', { name: 'Cerrar filtros' }).click();
  }
  await page.getByRole('button', { name: 'Reset' }).click();
  await page.locator('.cmd-card').first().getByRole('button', { name: /Guardar .* en favoritos/i }).click();
  if (mobile) {
    await page.getByRole('button', { name: /^Filtros/ }).click();
  }
  await filters.getByRole('button', { name: /Solo favoritos/i }).click();
  await expect(page.locator('.cmd-card')).toHaveCount(1);
});

test('constructor de comandos', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /tcpdump/i }).click();
  await expect(page.getByTestId('builder-command')).toContainText('tcpdump -i eth0 -nn -s0 port 443');
  await page.getByRole('button', { name: /-w.*Guardar pcap/i }).click();
  await page.getByRole('textbox', { name: 'Valor para -w' }).fill('evidencia.pcap');
  await expect(page.getByTestId('builder-command')).toContainText('evidencia.pcap');
});

test('tema claro y menú móvil', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile';
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  if (mobile) {
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(page.locator('#mobile-menu')).toHaveClass(/is-open/);
    await expect(page.locator('#mobile-menu').getByRole('link', { name: /Arsenal/ })).toBeVisible();
    await page.getByRole('button', { name: /Cambiar a tema claro/i }).click();
  } else {
    await page.getByRole('button', { name: 'Activar tema claro' }).click();
  }

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  if (mobile) {
    await expect(page.getByRole('button', { name: /Cambiar a tema oscuro/i })).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar menú' }).click();
  } else {
    await expect(page.getByRole('button', { name: 'Activar tema oscuro' })).toBeVisible();
  }
});

test('manuales de scripting: Bash, Python, búsqueda y recetas', async ({ page }) => {
  await page.goto('/#scripting');
  const section = page.locator('#scripting');
  await expect(section.getByRole('heading', { name: /Aprende el lenguaje/i })).toBeVisible();

  const bashTab = section.getByRole('tab', { name: /Bash/ });
  await expect(bashTab).toHaveAttribute('aria-selected', 'true');
  await expect(section.locator('.topic-card')).toHaveCount(BASH_MANUAL.chapters[0].topics.length);
  await expect(section.locator('.token--keyword').first()).toBeVisible();
  await expect(section.locator('.snippet__pre')).toHaveCount(BASH_MANUAL.chapters[0].topics.length);

  await section.getByRole('tab', { name: /Python 3/ }).click();
  await expect(section.getByRole('tab', { name: /Python 3/ })).toHaveAttribute('aria-selected', 'true');
  await expect(section.locator('.scripting-chapter-head h3')).toHaveText(PYTHON_MANUAL.chapters[0].title);

  const search = section.getByRole('searchbox', { name: /Buscar en el manual de Python 3/i });
  await search.fill('decorador');
  await expect(section.getByRole('heading', { name: 'Decoradores', exact: true })).toBeVisible();
  await section.getByRole('button', { name: /Limpiar filtros/ }).click();

  await section.getByRole('button', { name: /^Blue team/ }).click();
  await expect(section.getByRole('heading', { name: 'Entrada, salida y stderr', exact: true })).toBeVisible();
  await expect(section.getByRole('heading', { name: 'Intérprete, shebang y ejecución', exact: true })).toHaveCount(0);

  await section.getByRole('button', { name: /Recetas por rol/ }).click();
  await expect(section.locator('.recipe-card')).toHaveCount(2);
  await section.getByRole('button', { name: 'Todos', exact: true }).click();
  await expect(section.locator('.recipe-card')).toHaveCount(PYTHON_MANUAL.recipes.length);
});

test('captura visual desktop y móvil', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png` });

  for (const section of ['arsenal', 'constructor', 'tacticas', 'rutas', 'chuleta', 'glosario']) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await page.screenshot({ path: `test-results/${section}-${testInfo.project.name}.png` });
  }

  const scripting = page.locator('#scripting');
  await scripting.evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(1050);
  await page.screenshot({ path: `test-results/scripting-${testInfo.project.name}.png` });

  await scripting.getByRole('tab', { name: /Python 3/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `test-results/scripting-python-${testInfo.project.name}.png` });

  await scripting.locator('.topic-card').first().evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(450);
  await page.screenshot({ path: `test-results/scripting-code-${testInfo.project.name}.png` });

  if (testInfo.project.name === 'mobile') {
    await page.locator('#arsenal').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /^Filtros/ }).click();
    await page.waitForTimeout(350);
    await page.screenshot({ path: 'test-results/filters-mobile.png' });
    await page.getByRole('button', { name: 'Cerrar filtros' }).click();
  }

  await page.getByRole('searchbox', { name: 'Buscar comandos' }).fill('nmap');
  await page.getByRole('button', { name: 'Abrir ficha de nmap' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `test-results/dossier-${testInfo.project.name}.png` });
});
