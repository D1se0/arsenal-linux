# Arsenal Linux

**La base de datos de comandos de Linux para seguridad, sistemas y redes.**

Una aplicación estática construida con **React + Vite + TypeScript** que reúne **319 comandos** de Linux con **2.283 flags explicadas**, **628 subopciones anidadas** y **962 ejemplos** para red team, blue team, sysadmin y administración de redes.

Incluye además **dos manuales de scripting** —Bash y Python 3— con **87 temas**, **16 recetas por rol** y **103 ejemplos** adicionales, navegables, buscables y con resaltado de sintaxis.

> Documentación, no ejecución. Usa estos comandos solo sobre sistemas propios o con autorización escrita.

---

## Qué incluye

- **319 fichas de comandos** organizadas en 13 dominios: reconocimiento, escaneo, hacking web, explotación, contraseñas, redes, administración, shell, DFIR, hardening, malware, wireless y cloud.
- **Búsqueda instantánea** por comando, alias, flag, tag, táctica o texto de los ejemplos.
- **Filtros combinables** por dominio, rol, dificultad, riesgo y favoritos.
- **Dossier por comando** con descripción, sintaxis, tabla de parámetros, ejemplos comentados, buenas prácticas, tácticas MITRE y comandos relacionados.
- **Subparámetros desplegables**: opciones como los scripts NSE de nmap, los formatos de John/hashcat, los motores de SQLMap o las plantillas de Nuclei se explican dentro del parámetro con su propio ejemplo.
- **Enlaces directos** a cada ficha mediante `?cmd=<id>`.
- **Paleta de búsqueda** con `Ctrl+K` o `/`.
- **Constructor de comandos** interactivo para nmap, ffuf, tcpdump, find, journalctl, ssh y docker.
- **Seis rutas de aprendizaje** con progreso persistido en `localStorage`.
- **Siete chuletas rápidas**, glosario ampliado y preguntas frecuentes.
- **Manuales de scripting Bash y Python 3**: 13 capítulos, 87 temas y 16 scripts completos. Incluyen control de flujo, funciones, tipos, POO, archivos, procesos, concurrencia, testing y seguridad, con ejemplos etiquetados por Red Team, Blue Team, Sysadmin y Redes.
- **Buscador propio de los manuales**, filtros por rol, referencias oficiales y bloques con resaltado de sintaxis para Bash y Python.
- **Mapa de cobertura MITRE ATT&CK** por táctica.
- Tema oscuro/claro, animaciones con `IntersectionObserver`, diseño responsive y soporte de `prefers-reduced-motion`.
- Sin backend, sin cookies y sin telemetría: todo ocurre en el navegador.

## Stack

| Pieza | Uso |
| --- | --- |
| React 19 | UI e interacción |
| Vite 8 | Build y dev server |
| TypeScript | Tipado estricto del modelo de datos |
| Lucide React | Iconografía |
| Space Grotesk + JetBrains Mono | Tipografía autoalojada vía Fontsource |
| Vitest + Testing Library | Tests unitarios y de componentes |
| Playwright | Tests end-to-end y capturas |
| GitHub Actions | Validación, tests y despliegue en Pages |

## Desarrollo

```bash
npm install
npm run dev
# http://localhost:5173
```

### Scripts

```bash
npm run dev        # servidor de desarrollo
npm run validate   # valida IDs, campos, relaciones, rutas y constructor
npm test           # tests de búsqueda, datos, componentes y App
npm run build      # typecheck + build de producción en dist/
npm run preview    # sirve dist/
npm run test:e2e   # Playwright desktop + móvil (requiere build previo)
npm run audit:tools # presencia, man y ayuda de las herramientas instaladas
```

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` se ejecuta al hacer push a `main`:

1. instala dependencias con `npm ci`;
2. valida la base de datos;
3. ejecuta los tests;
4. compila con Vite;
5. publica `dist` con las acciones oficiales de Pages.

Para activarlo:

1. Sube el proyecto a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En **Build and deployment → Source**, selecciona **GitHub Actions**.
4. Haz push a `main` o lanza el workflow manualmente.

Vite usa `base: './'`, de modo que los assets funcionan tanto en la raíz como en `usuario.github.io/repositorio/`. Las fichas usan query params (`?cmd=nmap`), no rutas de servidor, así que no hace falta configuración de rewrites.

## Añadir comandos

1. Crea o edita un archivo en `src/data/commands/` (por ejemplo `web.ts`).
2. Añade un objeto `Command` con un `id` único en kebab-case.
3. Importa el array en `src/data/commands/index.ts`.
4. Ejecuta `npm run validate` y `npm test`.

Ejemplo mínimo:

```ts
{
  id: 'mi-comando',
  name: 'mi-comando',
  category: 'shell',
  roles: ['admin', 'blue'],
  difficulty: 'inicial',
  danger: 'bajo',
  summary: 'Qué hace en una frase.',
  description: 'Explicación con contexto y cuándo usarlo.',
  syntax: 'mi-comando [opciones] <objetivo>',
  params: [
    { flag: '-v', desc: 'Salida detallada.' },
    {
      flag: '--format <tipo>',
      desc: 'Formato de salida.',
      options: [
        { value: 'json', desc: 'Salida JSON para automatizar.', example: 'mi-comando --format json' },
        { value: 'text', desc: 'Salida legible para humanos.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Uso básico',
      kind: 'admin',
      code: 'mi-comando -v objetivo',
      explain: 'Qué demuestra este ejemplo y qué revisar en la salida.',
    },
    {
      title: 'Uso defensivo',
      kind: 'blue',
      code: 'mi-comando --audit',
      explain: 'Cómo se usa desde el lado defensivo.',
    },
  ],
  tips: ['Una advertencia o buena práctica.'],
  tags: ['ejemplo', 'shell'],
  tactics: ['Discovery'],
  related: ['grep'],
}
```

El validador comprueba IDs duplicados, campos vacíos, categorías, roles, dificultades, riesgos, tácticas, ejemplos y referencias a rutas o al constructor.

## Manuales de scripting

La sección `#scripting` está pensada como documentación de consulta, no como una colección de recetas peligrosas. Cada manual se organiza en capítulos y cada tema incluye:

- nivel y rol principal;
- sintaxis mínima;
- código completo con resaltado de tokens;
- salida cuando aporta valor;
- puntos clave y errores típicos;
- referencias oficiales del lenguaje.

Cobertura actual:

| Manual | Capítulos | Temas | Recetas |
| --- | ---: | ---: | ---: |
| Bash 5.x | 6 | 39 | 8 |
| Python 3.11+ | 7 | 48 | 8 |

Bash cubre shebang, quoting, variables, arrays, `if`, `case`, `for`, `while`, `until`, `read`, funciones, `getopts`, expansión de parámetros, here-docs, `trap`, `flock`, `set -euo pipefail` y logging. Python cubre entorno virtual, `argparse`, tipos, comprensiones, control de flujo, funciones, decoradores, generadores, POO, dataclasses, excepciones, `pathlib`, JSON/CSV, `subprocess`, hilos, asyncio, secretos y testing.

Las 16 recetas finales son scripts completos por rol: alcance autorizado, inventario, detección de autenticación fallida, integridad, backups, salud de servicios, MTU, puertos, HTTP, logs, IOCs y limpieza segura.

## Estructura

```text
src/
  components/        # Nav, Hero, Explorer, CommandDrawer, Builder, etc.
  data/
    commands/        # colecciones de fichas por dominio + agregador
    categories.ts    # metadatos visuales de cada dominio
    site.ts          # rutas, chuletas, glosario y FAQ
    builder.ts       # especificaciones del constructor
    scripting/       # manuales Bash/Python, tipos y agregador
    types.ts         # modelo de datos y taxonomías
  lib/
    search.ts        # motor de búsqueda ponderado y filtros
    highlight.ts     # tokenizador y resaltado Bash/Python sin dependencias
    utils.ts         # helpers de UI y portapapeles
  styles/            # sistema de diseño (base + secciones)
  test/              # setup de jsdom
scripts/
  validate-commands.ts
  audit-toolchain.ts # auditoría local de binarios y ayuda
tests/e2e/           # Playwright (incluye cobertura total del catálogo)
audit/               # informe local de herramientas (ignorado por Git)
.github/workflows/   # deploy a Pages
```

## Metodología y límites

- Los comandos se documentan a partir de la sintaxis pública de cada herramienta y de buenas prácticas de administración y seguridad.
- **No se ejecutan comandos peligrosos desde la web.** La aplicación es estática y el botón de copiar no lanza nada en el sistema.
- La validación automática garantiza coherencia del contenido (estructura, IDs, referencias), no que cada flag exista en tu versión instalada. Verifica siempre con `man`, `--help` y la documentación oficial antes de ejecutar.
- Muchas herramientas (Kali, Metasploit, Impacket, Volatility, etc.) deben instalarse aparte. Las fichas indican el contexto, no sustituyen la documentación del fabricante.
- Los manuales de scripting no son un volcado literal del `--help` de cada versión. Documentan el lenguaje, sus estructuras principales y patrones de automatización; la referencia normativa sigue siendo la documentación oficial enlazada en cada manual.

## Licencia y uso

Proyecto educativo y de consulta. No incluye exploits ni cargas maliciosas. Eres responsable del uso que hagas de los comandos y de cumplir la ley de tu jurisdicción.
