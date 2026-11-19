import type { ScriptManual } from './types';

export const PYTHON_MANUAL: ScriptManual = {
  id: 'python',
  label: 'Python 3',
  version: 'Python 3.11+',
  accent: 'cyan',
  headline: 'Scripting legible, tipado y seguro desde el primer archivo.',
  description:
    'Manual de Python 3 orientado a automatización real: entorno, tipos, control de flujo, funciones, POO, errores, archivos, concurrencia, testing y seguridad. Cada concepto incluye código, salida cuando aporta y trampas frecuentes.',
  chapters: [
    {
      id: 'entorno',
      title: 'Intérprete y entorno',
      summary:
        'Cómo se ejecuta Python, cómo aislar dependencias, cómo estructurar el punto de entrada y cómo recibir argumentos sin inventar parsers.',
      topics: [
        {
          id: 'interprete',
          title: 'Intérprete, shebang y ejecución',
          summary:
            'Un script de Python es un archivo de texto con extensión .py. El shebang permite ejecutarlo directamente si tiene permisos.',
          role: 'admin',
          level: 'base',
          syntax: 'python3 script.py',
          code: `#!/usr/bin/env python3
"""Primer script documentado."""

import sys

def main() -> int:
    print(f"Python {sys.version_info.major}.{sys.version_info.minor}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())`,
          output: 'Python 3.11',
          points: [
            '`python3` es el intérprete de Python 3; `python` puede apuntar a Python 2 en sistemas antiguos.',
            'El shebang `#!/usr/bin/env python3` respeta el Python del PATH.',
            'Da permisos con `chmod 750 script.py` para ejecutarlo como `./script.py`.',
            'Usa `python3 -m py_compile script.py` para comprobar sintaxis sin ejecutar.',
          ],
          gotcha:
            'No escribas código de producción directamente en `python3 -c` si tiene más de una línea: el quoting del shell se vuelve frágil.',
        },
        {
          id: 'venv',
          title: 'Entornos virtuales y dependencias',
          summary:
            'Un venv aísla paquetes por proyecto. Evita instalar librerías globales que rompan otras herramientas del sistema.',
          role: 'admin',
          level: 'base',
          syntax: 'python3 -m venv .venv',
          code: `import sys
from pathlib import Path

if not Path(".venv").is_dir():
    raise SystemExit("Crea el entorno: python3 -m venv .venv")

if sys.prefix == sys.base_prefix:
    raise SystemExit("Activa el entorno: source .venv/bin/activate")

print(f"entorno activo: {sys.prefix}")
print("dependencias: python -m pip install -r requirements.txt")`,
          points: [
            'Activa el entorno con `source .venv/bin/activate` en Linux/macOS; en Windows, `.venv\\Scripts\\activate`.',
            'Usa siempre `python -m pip` para asegurarte de que instalas en el intérprete correcto.',
            'Fija versiones en `requirements.txt` o usa un gestor con lockfile para builds reproducibles.',
            'No versiones `.venv/`; sí versiona `requirements.txt` o `pyproject.toml`.',
          ],
          gotcha:
            'No ejecutes `sudo pip install` para un script de usuario. Mezcla paquetes globales y puede romper el sistema.',
        },
        {
          id: 'main',
          title: 'Punto de entrada y funciones main',
          summary:
            'Separar la lógica en funciones y usar `if __name__ == "__main__"` permite importar el archivo sin ejecutar el script completo.',
          role: 'network',
          level: 'base',
          syntax: 'if __name__ == "__main__":',
          code: `from pathlib import Path

def contar_lineas(ruta: Path) -> int:
    with ruta.open(encoding="utf-8") as archivo:
        return sum(1 for _ in archivo)

def main() -> int:
    ruta = Path("hosts.txt")
    if not ruta.is_file():
        print(f"No existe: {ruta}", file=sys.stderr)
        return 1
    print(f"líneas={contar_lineas(ruta)}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())`,
          points: [
            '`__name__` vale `"__main__"` cuando ejecutas el archivo y el nombre del módulo cuando lo importas.',
            '`raise SystemExit(main())` convierte el retorno en código de salida del proceso.',
            'Mantén `main()` pequeña: lee argumentos, valida y delega en funciones puras.',
            'Importar un módulo no debe tener efectos secundarios como borrar archivos o abrir puertos.',
          ],
          gotcha:
            'El ejemplo usa `sys` sin importarlo. Añade `import sys`; un fallo de importación es tan real como cualquier otro.',
        },
        {
          id: 'argparse',
          title: 'argparse: argumentos con ayuda automática',
          summary:
            'La biblioteca estándar incluye un parser robusto para flags cortas, largas, tipos, valores por defecto y subcomandos.',
          role: 'red',
          level: 'intermedio',
          syntax: 'parser.add_argument("--host", required=True)',
          code: `import argparse

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Comprueba un objetivo autorizado."
    )
    parser.add_argument("target", help="host o URL")
    parser.add_argument("-p", "--port", type=int, default=443)
    parser.add_argument("--timeout", type=float, default=3.0)
    parser.add_argument("-v", "--verbose", action="store_true")
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_args()
    print(args.target, args.port, args.verbose)`,
          points: [
            '`type=int` convierte y valida; un valor inválido termina con un error claro.',
            '`required=True` hace obligatoria una flag opcional; los posicionales ya lo son.',
            '`action="store_true"` crea un booleano; `choices=[...]` restringe valores.',
            'Los subcomandos se crean con `add_subparsers(dest="comando")`.',
          ],
          gotcha:
            'No uses `sys.argv` a mano para herramientas con más de dos flags. `argparse` genera ayuda, errores y códigos de salida correctos.',
        },
        {
          id: 'entrada-salida',
          title: 'Entrada, salida y stderr',
          summary:
            '`input()` lee una línea interactiva; `sys.stdin` permite tuberías. Los errores van a stderr para no contaminar datos.',
          role: 'blue',
          level: 'base',
          syntax: 'print(..., file=sys.stderr)',
          code: `import getpass
import sys

def main() -> int:
    if not sys.stdin.isatty():
        for linea in sys.stdin:
            print(linea.rstrip().upper())
        return 0

    usuario = input("Usuario: ").strip()
    clave = getpass.getpass("Contraseña: ")
    if not usuario or not clave:
        print("faltan credenciales", file=sys.stderr)
        return 2
    print(f"usuario={usuario}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())`,
          points: [
            '`input()` siempre devuelve una cadena; convierte y valida antes de usarla.',
            '`sys.stdin.isatty()` distingue una terminal de una tubería o un cron.',
            '`print(..., file=sys.stderr)` separa diagnóstico de datos.',
            '`getpass.getpass()` no muestra la contraseña en pantalla, pero no la cifra en memoria.',
          ],
          gotcha:
            'No uses `input()` en un script que se ejecuta desde cron o systemd: no hay terminal y fallará o se quedará bloqueado.',
        },
        {
          id: 'fstrings',
          title: 'f-strings y formato moderno',
          summary:
            'Las f-strings combinan texto y expresiones con formato legible. Son la forma recomendada desde Python 3.6.',
          role: 'admin',
          level: 'base',
          syntax: 'f"{valor:.2f}"',
          code: `nombre = "api"
latencia = 0.18342
intentos = 3

print(f"servicio={nombre} latencia={latencia:.3f}s intentos={intentos:03d}")
print(f"{'SERVICIO':<12}{'ESTADO':>10}")
print(f"{nombre:<12}{'ok':>10}")
print(f"debug: {latencia=}")`,
          output: 'servicio=api latencia=0.183s intentos=003\nSERVICIO        ESTADO\napi                   ok\ndebug: latencia=0.18342',
          points: [
            '`:.2f` fija dos decimales; `:03d` rellena con ceros; `<12` y `>10` alinean.',
            '`{variable=}` imprime nombre y valor, útil para depuración temporal.',
            'Puedes llamar funciones dentro de una f-string, pero evita expresiones enormes.',
            'Para plantillas de usuario, usa `string.Template` o un motor con autoescape; una f-string no escapa HTML.',
          ],
          gotcha:
            'No construyas SQL, HTML o shell con f-strings a partir de entrada del usuario. Eso es inyección, no formato.',
        },
      ],
    },
    {
      id: 'tipos',
      title: 'Tipos y colecciones',
      summary:
        'str, list, tuple, dict, set, slicing, desempaquetado y comprensiones. Elegir la estructura correcta simplifica todo lo demás.',
      topics: [
        {
          id: 'strings',
          title: 'Cadenas y métodos esenciales',
          summary:
            'Las cadenas son inmutables. Los métodos devuelven nuevas cadenas; no modifican la original.',
          role: 'red',
          level: 'base',
          syntax: '"texto".strip().split(",")',
          code: `linea = "  admin,10.0.0.5,22  "
partes = linea.strip().split(",")
usuario, host, puerto = partes

print(usuario.upper())
print(host.startswith("10."))
print(":".join([host, puerto]))
print(linea.replace("admin", "operador").strip())`,
          output: 'ADMIN\nTrue\n10.0.0.5:22\noperador,10.0.0.5,22',
          points: [
            '`strip`, `lstrip`, `rstrip` eliminan espacios o caracteres concretos.',
            '`split` sin argumento separa por cualquier espacio; con separador conserva campos vacíos.',
            '`startswith`, `endswith`, `find`, `replace`, `casefold` cubren la mayoría de búsquedas.',
            'Para patrones complejos usa el módulo `re`, no cadenas de `replace` encadenadas.',
          ],
          gotcha:
            '`str` es inmutable: `texto.upper()` no cambia `texto`. Tienes que reasignar el resultado.',
        },
        {
          id: 'listas',
          title: 'Listas: orden, mutación y copias',
          summary:
            'Las listas son secuencias mutables. Ordenar, añadir y copiar correctamente evita efectos laterales inesperados.',
          role: 'admin',
          level: 'base',
          syntax: 'lista.append(valor)',
          code: `hosts = ["web-01", "db-01"]
hosts.append("proxy-01")
hosts.extend(["cache-01", "worker-01"])
hosts.sort()

copia = hosts.copy()
copia.remove("db-01")

print(hosts)
print(copia)
print(len(hosts), hosts[0], hosts[-1])`,
          output: "['cache-01', 'db-01', 'proxy-01', 'web-01', 'worker-01']\n['cache-01', 'proxy-01', 'web-01', 'worker-01']\n5 cache-01 worker-01",
          points: [
            '`append` añade un elemento; `extend` añade varios; `insert(i, x)` inserta en una posición.',
            '`sort()` modifica la lista y devuelve `None`; `sorted()` devuelve una copia ordenada.',
            '`lista.copy()` o `lista[:]` hacen copia superficial; para estructuras anidadas usa `copy.deepcopy`.',
            '`remove` borra por valor y falla si no existe; `pop` borra por índice y devuelve el valor.',
          ],
          gotcha:
            '`lista2 = lista1` no copia: crea otro nombre para el mismo objeto. Modificar una afecta a la otra.',
        },
        {
          id: 'diccionarios',
          title: 'Diccionarios y acceso seguro',
          summary:
            'Los diccionarios mapean claves a valores y conservan el orden de inserción desde Python 3.7. `get` y `setdefault` evitan KeyError.',
          role: 'blue',
          level: 'base',
          syntax: 'datos.get("clave", default)',
          code: `evento = {"ip": "10.0.0.5", "usuario": "ana", "intentos": 3}

print(evento["ip"])
print(evento.get("pais", "desconocido"))
evento["riesgo"] = "alto"
evento.update({"intentos": 4, "bloqueado": True})

for clave, valor in evento.items():
    print(f"{clave}={valor}")`,
          points: [
            '`d[key]` lanza `KeyError` si falta; `d.get(key, default)` devuelve el valor por defecto.',
            '`setdefault(key, default)` crea la clave solo si no existe.',
            '`items()` itera pares, `keys()` claves y `values()` valores.',
            'Para contar usa `collections.Counter`, no un `if key in dict` manual.',
          ],
          gotcha:
            'No modifiques un diccionario mientras lo recorres con `for key in d`. Itera `list(d.items())` si necesitas borrar.',
        },
        {
          id: 'sets-tuplas',
          title: 'Sets y tuplas',
          summary:
            'Un set elimina duplicados y hace operaciones de conjuntos. Una tupla es una secuencia inmutable y hashable.',
          role: 'network',
          level: 'intermedio',
          syntax: 'set(lista)',
          code: `antes = {"10.0.0.1", "10.0.0.2", "10.0.0.3"}
despues = {"10.0.0.2", "10.0.0.3", "10.0.0.4"}

print("nuevos:", sorted(despues - antes))
print("retirados:", sorted(antes - despues))
print("comunes:", sorted(antes & despues))

punto = ("10.0.0.5", 443)
host, puerto = punto
print(f"{host}:{puerto}")`,
          output: "nuevos: ['10.0.0.4']\nretirados: ['10.0.0.1']\ncomunes: ['10.0.0.2', '10.0.0.3']\n10.0.0.5:443",
          points: [
            '`|` unión, `&` intersección, `-` diferencia, `^` diferencia simétrica.',
            'Los sets no conservan orden y no admiten elementos no hashables como listas.',
            'Una tupla se usa para datos fijos y como clave de diccionario.',
            'Una tupla de un solo elemento necesita coma: `(valor,)`.',
          ],
          gotcha:
            '`set("texto")` crea un conjunto de caracteres, no un conjunto con la cadena. Usa `{"texto"}`.',
        },
        {
          id: 'slicing',
          title: 'Slicing y secuencias',
          summary:
            'El slicing extrae subsecuencias con inicio, fin y paso. No lanza IndexError si el rango se sale; simplemente devuelve lo posible.',
          role: 'admin',
          level: 'base',
          syntax: 'secuencia[inicio:fin:paso]',
          code: `hosts = ["web-01", "web-02", "db-01", "db-02", "proxy-01"]

print(hosts[:2])
print(hosts[-2:])
print(hosts[::2])
print(hosts[::-1])
print(hosts[1:4:2])
print(hosts[100:])`,
          output: "['web-01', 'web-02']\n['db-02', 'proxy-01']\n['web-01', 'db-01', 'proxy-01']\n['proxy-01', 'db-02', 'db-01', 'web-02', 'web-01']\n['web-02', 'db-02']\n[]",
          points: [
            'El índice final no se incluye. `[0:2]` devuelve posiciones 0 y 1.',
            'Los índices negativos cuentan desde el final: `-1` es el último.',
            'El paso negativo invierte la secuencia.',
            'Una asignación a un slice puede cambiar la longitud de una lista: `lista[1:3] = [...]`.',
          ],
          gotcha:
            'El slicing de una lista hace una copia superficial. Los objetos internos siguen siendo compartidos.',
        },
        {
          id: 'unpacking',
          title: 'Desempaquetado y operador estrella',
          summary:
            'Python permite asignar varios valores a la vez, intercambiar variables y recoger el resto en una lista.',
          role: 'network',
          level: 'intermedio',
          syntax: 'primero, *resto = secuencia',
          code: `host, puerto, *opciones = ["10.0.0.5", "443", "--tls", "--verbose"]
print(host, puerto, opciones)

a, b = 1, 2
a, b = b, a
print(a, b)

def mostrar(*args, **kwargs):
    print(args, kwargs)

mostrar("x", "y", modo="seguro")`,
          output: "10.0.0.5 443 ['--tls', '--verbose']\n2 1\n('x', 'y') {'modo': 'seguro'}",
          points: [
            'El `*` recoge los elementos restantes en una lista.',
            'En llamadas, `*args` desempaqueta una secuencia y `**kwargs` un diccionario.',
            'Puedes combinar desempaquetado posicional y con nombre en la misma llamada.',
          ],
          gotcha:
            'Solo puede haber un `*resto` por asignación. No puedes usar dos en el mismo nivel.',
        },
        {
          id: 'comprehensions',
          title: 'Comprensiones y generadores',
          summary:
            'Una comprensión crea una colección en una expresión. Un generador produce valores bajo demanda y no carga todo en memoria.',
          role: 'red',
          level: 'intermedio',
          syntax: '[expr for x in iterable if condición]',
          code: `hosts = ["10.0.0.1", "10.0.0.2", "10.0.0.3", "10.0.0.4"]
activos = [ip for ip in hosts if not ip.endswith(".1")]

puertos = {22: "ssh", 80: "http", 443: "https"}
nombres = {puerto: nombre.upper() for puerto, nombre in puertos.items()}

lineas = (linea.strip() for linea in open("hosts.txt", encoding="utf-8"))
print(next(lineas, "sin datos"))`,
          points: [
            'List comprehension: `[...]`; set comprehension: `{...}`; dict comprehension: `{k: v for ...}`.',
            'Un generador usa paréntesis `(...)` y se consume una sola vez.',
            'Las comprensiones son legibles para una condición y una transformación; si necesitas tres, usa un bucle.',
            '`sum(1 for x in datos if ...)` cuenta sin crear una lista intermedia.',
          ],
          gotcha:
            'No abuses de efectos secundarios dentro de una comprensión. Si necesitas imprimir o modificar, usa un `for` normal.',
        },
      ],
    },
    {
      id: 'control',
      title: 'Control de flujo',
      summary:
        'if, match, for, while y las funciones de iteración que evitan índices manuales. Menos código, menos errores off-by-one.',
      topics: [
        {
          id: 'if',
          title: 'if, elif, else y truthiness',
          summary:
            'Python evalúa cualquier objeto como booleano. Vacío, cero y None son falsos; el resto suele ser verdadero.',
          role: 'admin',
          level: 'base',
          syntax: 'if condición: ...',
          code: `def estado(activo: bool, errores: int) -> str:
    if not activo:
        return "detenido"
    if errores == 0:
        return "sano"
    elif errores < 5:
        return "degradado"
    else:
        return "crítico"

print(estado(True, 0))
print(estado(True, 3))
print(estado(False, 0))`,
          output: 'sano\ndegradado\ndetenido',
          points: [
            'Una lista vacía, un dict vacío, `0`, `""` y `None` son falsos.',
            'Usa `is None` para comparar con None, no `== None`.',
            'El operador ternario `"ok" if activo else "fallo"` sustituye un if de una línea.',
            'Comprueba primero los casos inválidos y sal pronto (early return).',
          ],
          gotcha:
            '`if valor:` no distingue una lista vacía de `None`. Si esa diferencia importa, comprueba `if valor is not None` y la longitud por separado.',
        },
        {
          id: 'match',
          title: 'match/case estructural',
          summary:
            'Desde Python 3.10, `match` compara patrones de estructura, no solo valores. Es potente para respuestas JSON y comandos.',
          role: 'blue',
          level: 'avanzado',
          syntax: 'match valor: case patrón: ...',
          code: `def clasificar(evento: dict) -> str:
    match evento:
        case {"tipo": "login", "ok": True, "usuario": usuario}:
            return f"login correcto: {usuario}"
        case {"tipo": "login", "ok": False, "intentos": intentos} if intentos >= 5:
            return "posible fuerza bruta"
        case {"tipo": "login", "ok": False}:
            return "login fallido"
        case _:
            return "evento desconocido"

print(clasificar({"tipo": "login", "ok": False, "intentos": 7}))`,
          output: 'posible fuerza bruta',
          points: [
            'Los patrones con `{}` extraen claves de un diccionario y pueden añadir guardas con `if`.',
            '`case _:` es el comodín final; sin él, un valor no coincidente simplemente no hace nada.',
            'También puedes hacer match de listas, tuplas, clases y literales.',
            'No es un `switch` de C: no hay fallthrough y el orden de los casos importa.',
          ],
          gotcha:
            'Un `case` con nombre de variable captura cualquier valor; no pretendías comparar con una constante. Usa puntos para constantes: `case Color.ROJO:`',
        },
        {
          id: 'for',
          title: 'for sobre iterables',
          summary:
            'El `for` de Python recorre elementos, no índices. Si necesitas el índice, usa `enumerate`; si necesitas dos listas, `zip`.',
          role: 'admin',
          level: 'base',
          syntax: 'for elemento in iterable:',
          code: `hosts = ["web-01", "db-01", "proxy-01"]

for host in hosts:
    print(f"revisando {host}")

for indice, host in enumerate(hosts, start=1):
    print(f"{indice:02d}. {host}")

for host, puerto in zip(hosts, [80, 5432, 3128]):
    print(f"{host}:{puerto}")`,
          points: [
            'Cualquier iterable funciona: listas, tuplas, strings, dicts, archivos, generadores.',
            '`enumerate(iterable, start=1)` evita `range(len(lista))`.',
            '`zip` se detiene en el iterable más corto; usa `zip(..., strict=True)` para detectar longitudes distintas.',
            'Iterar un diccionario devuelve claves; usa `.items()` para pares.',
          ],
          gotcha:
            'No modifiques la lista que estás recorriendo. Crea una copia (`for x in lista[:]`) o construye una nueva.',
        },
        {
          id: 'while',
          title: 'while y bucles controlados',
          summary:
            '`while` repite mientras la condición sea verdadera. En automatización debe tener timeout, límite de intentos o una señal de parada.',
          role: 'network',
          level: 'base',
          syntax: 'while condición: ...',
          code: `import time

intentos = 0
while intentos < 5:
    intentos += 1
    print(f"intento {intentos}")
    if intentos == 3:
        break
    time.sleep(0.1)
else:
    print("sin break")

print("fin")`,
          output: 'intento 1\nintento 2\nintento 3\nfin',
          points: [
            'El `else` del bucle se ejecuta si el bucle termina sin `break`.',
            '`break` sale del bucle; `continue` salta a la siguiente iteración.',
            'Evita `while True` sin una condición de salida clara.',
            '`time.sleep` acepta segundos decimales; para esperas cancelables usa `asyncio.sleep`.',
          ],
          gotcha:
            'Un `while` que espera un recurso debe registrar el tiempo y abortar. Un bucle infinito en un servicio puede consumir CPU o bloquear un worker.',
        },
        {
          id: 'range-enumerate',
          title: 'range, enumerate y zip',
          summary:
            'Son las tres funciones que sustituyen los bucles por índice. `range` genera números, `enumerate` añade posición y `zip` combina iterables.',
          role: 'admin',
          level: 'base',
          syntax: 'range(inicio, fin, paso)',
          code: `for i in range(3):
    print(i, end=" ")
print()

for i in range(10, 0, -2):
    print(i, end=" ")
print()

nombres = ["a", "b"]
valores = [1, 2, 3]
print(list(zip(nombres, valores)))
print(list(enumerate("xyz", start=1)))`,
          output: '0 1 2 \n10 8 6 4 2 \n[(\'a\', 1), (\'b\', 2)]\n[(1, \'x\'), (2, \'y\'), (3, \'z\')]',
          points: [
            '`range` no crea una lista en Python 3: es un objeto perezoso.',
            'El fin nunca se incluye. `range(3)` produce 0, 1 y 2.',
            '`zip` se detiene en el más corto; `itertools.zip_longest` rellena los que faltan.',
            '`enumerate` es más legible y seguro que llevar un contador manual.',
          ],
          gotcha:
            'No uses `range(len(secuencia))` para luego indexar si solo necesitas los elementos. Es más lento y más propenso a errores.',
        },
        {
          id: 'control-avanzado',
          title: 'break, continue y bucles anidados',
          summary:
            'El control de bucles en Python es explícito. Para salir de dos niveles, extrae una función o usa una bandera clara.',
          role: 'red',
          level: 'intermedio',
          syntax: 'for ...: if ...: break',
          code: `def primer_abierto(hosts: list[str], puertos: list[int]) -> tuple[str, int] | None:
    for host in hosts:
        for puerto in puertos:
            if puerto == 443:
                return host, puerto
    return None

resultado = primer_abierto(["web-01", "db-01"], [22, 80, 443])
print(resultado)`,
          output: "('web-01', 443)",
          points: [
            '`return` dentro de una función sale de todos los bucles de esa función.',
            '`break` solo sale del bucle más interno.',
            'Una bandera `encontrado = True` funciona, pero una función con retorno temprano suele ser más limpia.',
            '`for ... else` puede indicar que no se encontró nada sin una bandera.',
          ],
          gotcha:
            'No uses excepciones para controlar un flujo normal de búsqueda. Una excepción debe representar un error, no “no encontrado”.',
        },
      ],
    },
    {
      id: 'funciones',
      title: 'Funciones y tipos',
      summary:
        'Definición, valores por defecto, *args, **kwargs, type hints, lambdas, closures, decoradores y generadores. La caja de herramientas para componer scripts.',
      topics: [
        {
          id: 'def',
          title: 'Definir funciones y documentarlas',
          summary:
            'Una función debe hacer una cosa, tener un nombre verbal y documentar parámetros, retorno y excepciones.',
          role: 'admin',
          level: 'base',
          syntax: 'def nombre(param: tipo) -> tipo:',
          code: `def normalizar_host(valor: str) -> str:
    """Devuelve un host en minúsculas y sin espacios.

    Raises:
        ValueError: si el valor queda vacío.
    """
    host = valor.strip().casefold()
    if not host:
        raise ValueError("host vacío")
    return host

print(normalizar_host("  WEB-01.Example.COM "))`,
          output: 'web-01.example.com',
          points: [
            'Los type hints no se aplican en tiempo de ejecución, pero documentan y permiten analizar con mypy.',
            'Un docstring explica el contrato, no repite el nombre de la función.',
            'Usa `raise ValueError` para entradas inválidas y deja que el llamador decida cómo responder.',
            'Las funciones pequeñas son más fáciles de testear y reutilizar.',
          ],
          gotcha:
            'No devuelvas `None` y un valor de error mezclados sin documentarlo. Sé consistente o lanza una excepción.',
        },
        {
          id: 'defaults',
          title: 'Parámetros, defaults y el peligro mutable',
          summary:
            'Los argumentos por defecto se evalúan una sola vez. Nunca uses una lista o un dict como valor por defecto si la función los modifica.',
          role: 'blue',
          level: 'intermedio',
          syntax: 'def f(valor=None):',
          code: `def añadir_evento(evento: str, eventos: list[str] | None = None) -> list[str]:
    if eventos is None:
        eventos = []
    eventos.append(evento)
    return eventos

print(añadir_evento("login"))
print(añadir_evento("logout"))
print(añadir_evento("scan", ["previo"]))`,
          output: "['login']\n['logout']\n['previo', 'scan']",
          points: [
            '`None` como centinela permite crear una estructura nueva en cada llamada.',
            'Los argumentos posicionales se asignan por orden; los nombrados por nombre.',
            'Los parámetros con default deben ir después de los obligatorios.',
            'Puedes forzar argumentos solo-nombre con `def f(*, host, puerto):`.',
          ],
          gotcha:
            '`def f(lista=[])` comparte la misma lista entre llamadas. Es uno de los bugs más clásicos de Python.',
        },
        {
          id: 'args-kwargs',
          title: '*args y **kwargs',
          summary:
            'Permiten aceptar un número variable de argumentos posicionales o nombrados. Úsalos cuando de verdad generalizas, no para evitar diseñar una firma.',
          role: 'network',
          level: 'intermedio',
          syntax: 'def f(*args, **kwargs):',
          code: `def ejecutar(comando: str, *flags: str, timeout: int = 10, **opciones: object) -> None:
    print("comando:", comando)
    print("flags:", flags)
    print("timeout:", timeout)
    print("opciones:", opciones)

ejecutar("nmap", "-sV", "-Pn", timeout=30, perfil="rápido")`,
          output: "comando: nmap\nflags: ('-sV', '-Pn')\ntimeout: 30\nopciones: {'perfil': 'rápido'}",
          points: [
            '`*args` es una tupla; `**kwargs` es un diccionario.',
            'En una llamada, `*` desempaqueta una secuencia y `**` un diccionario.',
            'Los parámetros después de `*args` son solo-nombre.',
            'No pases `**datos` de un usuario a una función que ejecuta comandos sin filtrar claves.',
          ],
          gotcha:
            '`**kwargs` puede ocultar errores de nombre. En APIs públicas, declara los parámetros importantes explícitamente.',
        },
        {
          id: 'typing',
          title: 'Type hints y comprobación estática',
          summary:
            'Los tipos documentan y permiten detectar errores antes de ejecutar. No sustituyen la validación de datos externos.',
          role: 'admin',
          level: 'intermedio',
          syntax: 'def f(x: int) -> str:',
          code: `from collections.abc import Iterable
from pathlib import Path

def leer_hosts(ruta: Path) -> list[str]:
    with ruta.open(encoding="utf-8") as archivo:
        return [linea.strip() for linea in archivo if linea.strip()]

def contar(hosts: Iterable[str]) -> int:
    return sum(1 for _ in hosts)

hosts = leer_hosts(Path("hosts.txt"))
print(contar(hosts))`,
          points: [
            'Usa `list[str]`, `dict[str, int]` y `tuple[str, int]` en Python 3.9+.',
            '`Iterable` acepta listas, generadores y cualquier secuencia; es más flexible que `list`.',
            '`Optional[T]` equivale a `T | None`; prefiere la sintaxis moderna en Python 3.10+.',
            'Ejecuta `mypy script.py` o `pyright` en CI para comprobar los tipos.',
          ],
          gotcha:
            'Un type hint no convierte una cadena en entero. Debes validar y convertir los datos que vienen de JSON, argv o red.',
        },
        {
          id: 'lambda',
          title: 'Lambdas y funciones de orden superior',
          summary:
            'Una lambda es una función anónima de una expresión. Es útil como clave de ordenación o filtro corto, no para lógica compleja.',
          role: 'red',
          level: 'base',
          syntax: 'lambda x: expresión',
          code: `hosts = [
    {"host": "db-01", "riesgo": 7},
    {"host": "web-01", "riesgo": 2},
    {"host": "proxy-01", "riesgo": 5},
]

por_riesgo = sorted(hosts, key=lambda item: item["riesgo"], reverse=True)
print([item["host"] for item in por_riesgo])
print(list(filter(lambda item: item["riesgo"] >= 5, hosts)))`,
          output: "['db-01', 'proxy-01', 'web-01']\n[{'host': 'db-01', 'riesgo': 7}, {'host': 'proxy-01', 'riesgo': 5}]",
          points: [
            '`sorted(key=...)` es la forma correcta de ordenar por un campo.',
            '`map` y `filter` siguen existiendo, pero una comprensión suele ser más legible.',
            'Una lambda no puede contener asignaciones ni varias sentencias.',
            'Para claves complejas, define una función con nombre y docstring.',
          ],
          gotcha:
            'No ordenes con `key=lambda x: x[1]` si no está claro qué es el índice 1. Usa una estructura con nombre o un diccionario.',
        },
        {
          id: 'closures',
          title: 'Closures y ámbito',
          summary:
            'Una función interna recuerda las variables de la función externa. `nonlocal` permite modificarlas.',
          role: 'blue',
          level: 'avanzado',
          syntax: 'def exterior(): def interior(): ...',
          code: `def crear_contador(inicio: int = 0):
    valor = inicio

    def incrementar(paso: int = 1) -> int:
        nonlocal valor
        valor += paso
        return valor

    return incrementar

contador = crear_contador(10)
print(contador())
print(contador(5))`,
          output: '11\n16',
          points: [
            'La función interna captura la variable, no una copia del valor.',
            '`nonlocal` modifica la variable del ámbito externo más cercano.',
            '`global` modifica el módulo; úsalo solo cuando sea realmente necesario.',
            'Un closure puede mantener estado sin crear una clase para algo trivial.',
          ],
          gotcha:
            'No uses closures para estado compartido entre hilos sin sincronización. Una variable capturada no es atómica por arte de magia.',
        },
        {
          id: 'decoradores',
          title: 'Decoradores',
          summary:
            'Un decorador envuelve una función para añadir comportamiento: logging, reintentos, permisos o medición de tiempo.',
          role: 'admin',
          level: 'avanzado',
          syntax: '@decorador',
          code: `import functools
import time

def medir(func):
    @functools.wraps(func)
    def envoltura(*args, **kwargs):
        inicio = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__}: {time.perf_counter() - inicio:.4f}s")
    return envoltura

@medir
def tarea() -> None:
    time.sleep(0.01)

tarea()`,
          points: [
            'Un decorador recibe una función y devuelve otra función.',
            '`functools.wraps` preserva nombre, docstring y metadatos.',
            'Puedes aceptar argumentos creando un decorador de tres niveles.',
            'No ocultes excepciones dentro de un decorador sin registrarlas.',
          ],
          gotcha:
            'Un decorador mal escrito puede romper la firma y la documentación. Usa `functools.wraps` y type hints.',
        },
        {
          id: 'generadores',
          title: 'Generadores y yield',
          summary:
            'Un generador produce valores bajo demanda, lo que permite procesar archivos enormes con memoria constante.',
          role: 'blue',
          level: 'avanzado',
          syntax: 'def generador(): yield valor',
          code: `from collections.abc import Iterator

def leer_eventos(ruta: str) -> Iterator[str]:
    with open(ruta, encoding="utf-8") as archivo:
        for linea in archivo:
            linea = linea.strip()
            if linea and not linea.startswith("#"):
                yield linea

for evento in leer_eventos("eventos.log"):
    print(evento)`,
          points: [
            '`yield` pausa la función y devuelve un valor; al reanudar continúa donde quedó.',
            'Un generador se consume una sola vez; si necesitas repetirlo, conviértelo en lista o crea otro.',
            '`yield from` delega en otro iterable.',
            'Son ideales para logs, archivos grandes y pipelines de transformación.',
          ],
          gotcha:
            'No llames a `len()` sobre un generador. No tiene longitud conocida; cuenta mientras lo consumes.',
        },
      ],
    },
    {
      id: 'poo',
      title: 'POO y modelo de datos',
      summary:
        'Clases, dataclasses, propiedades, métodos especiales, herencia y composición. Cuándo una clase aporta claridad y cuándo es una capa innecesaria.',
      topics: [
        {
          id: 'clases',
          title: 'Clases, __init__ y métodos',
          summary:
            'Una clase agrupa estado y comportamiento. `__init__` inicializa la instancia y `self` la referencia.',
          role: 'admin',
          level: 'base',
          syntax: 'class Nombre: def __init__(self, ...):',
          code: `class Host:
    def __init__(self, nombre: str, ip: str, puerto: int = 22) -> None:
        self.nombre = nombre
        self.ip = ip
        self.puerto = puerto

    def endpoint(self) -> str:
        return f"{self.ip}:{self.puerto}"

    def __repr__(self) -> str:
        return f"Host({self.nombre!r}, {self.ip!r}, {self.puerto!r})"

host = Host("web-01", "10.0.0.5", 443)
print(host.endpoint())
print(host)`,
          output: '10.0.0.5:443\nHost(\'web-01\', \'10.0.0.5\', 443)',
          points: [
            '`self` es el primer parámetro de los métodos de instancia; no es una palabra reservada.',
            '`__init__` no debe hacer trabajo pesado ni llamadas de red. Valida y asigna.',
            '`__repr__` devuelve una representación útil para depuración.',
            'Mantén los atributos públicos por defecto; usa propiedades cuando necesites lógica.',
          ],
          gotcha:
            'No uses `self` en una función que no sea método de instancia. Un `@staticmethod` no lo recibe y un `@classmethod` recibe la clase.',
        },
        {
          id: 'dataclasses',
          title: 'dataclasses',
          summary:
            'Una dataclass genera `__init__`, `__repr__` y comparación a partir de anotaciones. Reduce código repetitivo para objetos de datos.',
          role: 'network',
          level: 'intermedio',
          syntax: '@dataclass class Datos:',
          code: `from dataclasses import dataclass, field

@dataclass(frozen=True)
class Objetivo:
    host: str
    puerto: int = 443
    etiquetas: tuple[str, ...] = field(default_factory=tuple)

    def url(self) -> str:
        return f"https://{self.host}:{self.puerto}"

objetivo = Objetivo("api.example.com", etiquetas=("prod", "auth"))
print(objetivo)
print(objetivo.url())`,
          points: [
            '`frozen=True` hace la instancia inmutable y hashable.',
            'Usa `field(default_factory=list)` para listas o diccionarios mutables.',
            '`order=True` genera comparación por campos en orden.',
            'Puedes convertir una dataclass a dict con `dataclasses.asdict`.',
          ],
          gotcha:
            'No uses una lista como default directo en una dataclass: comparte la misma lista entre instancias. Usa `default_factory`.',
        },
        {
          id: 'properties',
          title: 'Propiedades y validación',
          summary:
            'Una propiedad permite ejecutar lógica al leer o asignar un atributo sin cambiar la interfaz pública.',
          role: 'admin',
          level: 'intermedio',
          syntax: '@property',
          code: `class Puerto:
    def __init__(self, valor: int) -> None:
        self.valor = valor

    @property
    def valor(self) -> int:
        return self._valor

    @valor.setter
    def valor(self, nuevo: int) -> None:
        if not 1 <= nuevo <= 65535:
            raise ValueError("puerto fuera de rango")
        self._valor = nuevo

p = Puerto(443)
print(p.valor)
p.valor = 8443
print(p.valor)`,
          points: [
            '`@property` convierte un método en atributo de solo lectura.',
            'El setter valida antes de asignar; el atributo interno se marca con `_`.',
            'No añadas propiedades triviales que solo devuelven un atributo público.',
            'Las propiedades no aceptan argumentos adicionales.',
          ],
          gotcha:
            'No hagas operaciones costosas o con efectos secundarios en un getter. Una propiedad debe parecer un atributo.',
        },
        {
          id: 'dunder',
          title: 'Métodos especiales',
          summary:
            'Los métodos dunder integran tus objetos con el lenguaje: impresión, comparación, longitud, contexto y operadores.',
          role: 'blue',
          level: 'avanzado',
          syntax: 'def __len__(self): ...',
          code: `class Inventario:
    def __init__(self, hosts: list[str]) -> None:
        self._hosts = list(hosts)

    def __len__(self) -> int:
        return len(self._hosts)

    def __iter__(self):
        return iter(self._hosts)

    def __contains__(self, host: str) -> bool:
        return host in self._hosts

    def __enter__(self):
        return self

    def __exit__(self, *exc) -> None:
        print("cerrando inventario")

with Inventario(["web-01", "db-01"]) as inv:
    print(len(inv), "web-01" in inv)
    print(list(inv))`,
          points: [
            '`__len__` habilita `len()`, `__iter__` el bucle y `__contains__` el operador `in`.',
            '`__enter__` y `__exit__` implementan el protocolo de contexto para `with`.',
            '`__eq__` y `__hash__` deben ser coherentes si usas objetos como claves.',
            'No implementes dunder por moda; cada uno cambia el comportamiento del lenguaje.',
          ],
          gotcha:
            'Si defines `__eq__` y quieres usar el objeto en un set o dict, define también `__hash__` correctamente.',
        },
        {
          id: 'herencia',
          title: 'Herencia, composición y super()',
          summary:
            'La herencia modela “es un”; la composición modela “tiene un”. Para scripting, composición suele ser más flexible.',
          role: 'admin',
          level: 'avanzado',
          syntax: 'class Hijo(Padre):',
          code: `class Notificador:
    def enviar(self, mensaje: str) -> None:
        raise NotImplementedError

class Email(Notificador):
    def enviar(self, mensaje: str) -> None:
        print(f"email: {mensaje}")

class Slack(Notificador):
    def enviar(self, mensaje: str) -> None:
        print(f"slack: {mensaje}")

class Alerta:
    def __init__(self, canal: Notificador) -> None:
        self.canal = canal

    def disparar(self, mensaje: str) -> None:
        self.canal.enviar(mensaje)

Alerta(Slack()).disparar("CPU al 95%")`,
          output: 'slack: CPU al 95%',
          points: [
            '`super().__init__()` inicializa la parte de la clase padre.',
            'Una clase abstracta puede usar `abc.ABC` y `@abstractmethod`.',
            'La composición evita jerarquías rígidas y facilita sustituir implementaciones.',
            'No heredes solo para reutilizar una función; extrae una función o compón.',
          ],
          gotcha:
            'La herencia múltiple tiene un orden de resolución (MRO) que puede sorprender. Si no lo necesitas, evítala.',
        },
        {
          id: 'enum',
          title: 'Enum y constantes con nombre',
          summary:
            'Un Enum evita cadenas mágicas y limita los valores posibles. Es ideal para estados, roles y niveles.',
          role: 'network',
          level: 'intermedio',
          syntax: 'class Estado(Enum): ...',
          code: `from enum import Enum, auto

class Estado(Enum):
    ABIERTO = auto()
    CERRADO = auto()
    FILTRADO = auto()

def describir(estado: Estado) -> str:
    match estado:
        case Estado.ABIERTO:
            return "accesible"
        case Estado.CERRADO:
            return "rechaza conexión"
        case Estado.FILTRADO:
            return "sin respuesta o bloqueado"

print(describir(Estado.FILTRADO))`,
          output: 'sin respuesta o bloqueado',
          points: [
            '`auto()` asigna valores únicos automáticamente.',
            '`Estado.ABIERTO.value` devuelve el valor interno.',
            'Los miembros son comparables por identidad y funcionan bien con `match`.',
            'Puedes crear un Enum desde un valor con `Estado(valor)`, que lanza `ValueError` si no existe.',
          ],
          gotcha:
            'No serialices un Enum directamente a JSON sin convertir: `json.dumps` no sabe hacerlo. Usa `.value` o un encoder.',
        },
      ],
    },
    {
      id: 'errores-datos',
      title: 'Errores, archivos y datos',
      summary:
        'Excepciones, context managers, pathlib, JSON, CSV y subprocess. La parte que convierte un script en una herramienta que no rompe el sistema.',
      topics: [
        {
          id: 'try',
          title: 'try/except/else/finally',
          summary:
            'Captura solo las excepciones que sabes manejar. Un `except Exception` vacío oculta fallos y dificulta el diagnóstico.',
          role: 'admin',
          level: 'base',
          syntax: 'try: ... except Error as exc: ...',
          code: `from pathlib import Path

def leer_config(ruta: Path) -> str:
    try:
        return ruta.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""
    except PermissionError as exc:
        raise RuntimeError(f"sin permisos: {ruta}") from exc
    except UnicodeDecodeError as exc:
        raise ValueError(f"archivo no UTF-8: {ruta}") from exc

print(leer_config(Path("no-existe.conf")))`,
          points: [
            '`else` se ejecuta si no hubo excepción; `finally` siempre se ejecuta.',
            'Usa `raise ... from exc` para conservar la causa original.',
            'Captura excepciones concretas y deja propagar lo inesperado.',
            'Un `except` vacío puede ocultar un `KeyboardInterrupt` o un error de programación.',
          ],
          gotcha:
            'No uses excepciones para controlar un flujo esperado si una comprobación simple es más clara. Pero no compruebes y actúes sin manejar la carrera entre ambos pasos.',
        },
        {
          id: 'excepciones',
          title: 'Excepciones propias',
          summary:
            'Una excepción de dominio comunica un error de negocio y permite al llamador distinguirlo de un fallo técnico.',
          role: 'blue',
          level: 'intermedio',
          syntax: 'class MiError(Exception): ...',
          code: `class ScopeInvalido(ValueError):
    """El alcance no cumple el formato esperado."""

def validar_scope(valor: str) -> str:
    valor = valor.strip()
    if not valor or " " in valor:
        raise ScopeInvalido(f"scope inválido: {valor!r}")
    return valor

try:
    validar_scope("10.0.0.0/24, 10.0.0.1")
except ScopeInvalido as exc:
    print(f"error de configuración: {exc}")`,
          output: "error de configuración: scope inválido: '10.0.0.0/24, 10.0.0.1'",
          points: [
            'Hereda de `Exception`, no de `BaseException`.',
            'Un nombre de excepción debe describir el problema, no la solución.',
            'Añade atributos si el llamador necesita datos estructurados del error.',
            'Documenta las excepciones en el docstring de la función.',
          ],
          gotcha:
            'No crees una excepción nueva para cada mensaje. Crea una jerarquía pequeña y útil.',
        },
        {
          id: 'context-managers',
          title: 'with y context managers',
          summary:
            '`with` garantiza la liberación de recursos aunque ocurra una excepción. Úsalo para archivos, locks, conexiones y temporales.',
          role: 'admin',
          level: 'intermedio',
          syntax: 'with recurso as valor:',
          code: `from contextlib import contextmanager
from pathlib import Path

@contextmanager
def archivo_temporal(ruta: Path):
    ruta.parent.mkdir(parents=True, exist_ok=True)
    try:
        yield ruta
    finally:
        ruta.unlink(missing_ok=True)

with archivo_temporal(Path("/tmp/arsenal/resultado.txt")) as ruta:
    ruta.write_text("evidencia\\n", encoding="utf-8")
    print(ruta.read_text(encoding="utf-8").strip())`,
          points: [
            'Un context manager clásico implementa `__enter__` y `__exit__`.',
            '`@contextmanager` convierte una función generadora en un context manager.',
            'El bloque `finally` se ejecuta incluso si el cuerpo lanza una excepción.',
            'Los archivos abiertos con `with` se cierran solos, también en caso de error.',
          ],
          gotcha:
            'No devuelvas un archivo abierto desde una función que usa `with`: se cerrará al salir y el llamador recibirá un recurso inutilizable.',
        },
        {
          id: 'pathlib',
          title: 'pathlib: rutas sin concatenar strings',
          summary:
            '`Path` representa rutas y ofrece operaciones legibles y portables. Evita `os.path.join` y las barras escritas a mano.',
          role: 'admin',
          level: 'base',
          syntax: 'Path("dir") / "archivo.txt"',
          code: `from pathlib import Path

base = Path("/var/log/arsenal")
informe = base / "resumen.txt"

base.mkdir(parents=True, exist_ok=True)
informe.write_text("ok\\n", encoding="utf-8")

print(informe.name)
print(informe.suffix)
print(informe.parent)
print(informe.exists(), informe.stat().st_size)`,
          output: 'resumen.txt\n.txt\n/var/log/arsenal\nTrue 3',
          points: [
            'El operador `/` une rutas sin preocuparse por el separador.',
            '`read_text`, `write_text`, `read_bytes` y `write_bytes` simplifican el acceso.',
            '`glob`, `rglob`, `iterdir` recorren directorios.',
            '`resolve()` normaliza; `expanduser()` resuelve `~`.',
          ],
          gotcha:
            '`Path("archivo")` es relativo al directorio de trabajo actual, no al directorio del script. Usa `Path(__file__).parent` si necesitas una ruta estable.',
        },
        {
          id: 'json',
          title: 'JSON con la biblioteca estándar',
          summary:
            '`json` convierte entre objetos Python y texto JSON. Valida la estructura antes de acceder a claves anidadas.',
          role: 'red',
          level: 'base',
          syntax: 'json.loads(texto)',
          code: `import json
from pathlib import Path

datos = json.loads(Path("inventario.json").read_text(encoding="utf-8"))
hosts = datos.get("hosts", [])

for host in hosts:
    if not isinstance(host, dict):
        continue
    nombre = host.get("nombre", "desconocido")
    ip = host.get("ip", "sin-ip")
    print(f"{nombre:12} {ip}")

salida = {"total": len(hosts), "activos": [h for h in hosts if h.get("activo")]}
print(json.dumps(salida, indent=2, ensure_ascii=False))`,
          points: [
            '`json.loads` parsea texto; `json.load` lee de un archivo; `json.dumps` serializa.',
            '`ensure_ascii=False` conserva caracteres Unicode legibles.',
            'JSON no tiene tuplas, sets ni fechas: conviértelas antes de serializar.',
            'Un JSON enorme puede consumir mucha memoria; considera `ijson` para streaming.',
          ],
          gotcha:
            'No uses `eval` para parsear JSON. `eval` ejecuta código; `json.loads` solo interpreta datos.',
        },
        {
          id: 'csv',
          title: 'CSV correcto con csv',
          summary:
            'El módulo `csv` gestiona comillas, separadores y saltos de línea internos. `split(",")` no es un parser de CSV.',
          role: 'blue',
          level: 'base',
          syntax: 'csv.DictReader(archivo)',
          code: `import csv
from pathlib import Path

with Path("eventos.csv").open(encoding="utf-8", newline="") as archivo:
    lector = csv.DictReader(archivo)
    for fila in lector:
        print(f"{fila['usuario']}: {fila['accion']}")

with Path("resumen.csv").open("w", encoding="utf-8", newline="") as archivo:
    escritor = csv.DictWriter(archivo, fieldnames=["usuario", "total"])
    escritor.writeheader()
    escritor.writerow({"usuario": "ana", "total": 3})`,
          points: [
            'Abre con `newline=""` para que el módulo controle los saltos de línea.',
            '`DictReader` usa la primera fila como nombres de columna.',
            '`DictWriter` escribe cabecera y filas con quoting correcto.',
            'Puedes indicar `delimiter`, `quotechar` y `quoting=csv.QUOTE_ALL`.',
          ],
          gotcha:
            'No uses `line.split(",")` si el CSV puede contener comas entre comillas. Romperás columnas y perderás datos.',
        },
        {
          id: 'subprocess',
          title: 'subprocess sin shell',
          summary:
            'Para ejecutar comandos externos, usa una lista de argumentos y `shell=False`. Evita construir una cadena con entrada del usuario.',
          role: 'network',
          level: 'intermedio',
          syntax: 'subprocess.run(["cmd", arg], check=True)',
          code: `import subprocess

resultado = subprocess.run(
    ["ping", "-c", "1", "-W", "2", "192.0.2.10"],
    capture_output=True,
    text=True,
    timeout=5,
    check=False,
)

print("código:", resultado.returncode)
print("salida:", resultado.stdout.strip())
if resultado.returncode != 0:
    print("error:", resultado.stderr.strip())`,
          points: [
            'Pasa una lista: `["grep", patron, archivo]`; cada elemento es un argumento.',
            '`shell=True` solo si controlas totalmente la cadena; con datos externos es una inyección de shell.',
            '`check=True` lanza `CalledProcessError` si el comando falla.',
            '`timeout` evita que un proceso colgado bloquee el script.',
          ],
          gotcha:
            'No uses `os.system` ni `subprocess.run(cmd, shell=True)` con variables de usuario. Es la puerta clásica a ejecución remota de comandos.',
        },
      ],
    },
    {
      id: 'modulos-concurrencia',
      title: 'Módulos, concurrencia y seguridad',
      summary:
        'Paquetes, logging, hilos, asyncio, procesos y secretos. Cómo crecer de un archivo a una herramienta mantenible sin introducir condiciones de carrera.',
      topics: [
        {
          id: 'imports',
          title: 'Imports, módulos y __name__',
          summary:
            'Un módulo es un archivo .py; un paquete es un directorio con `__init__.py` o estructura declarada. Los imports deben ser explícitos y sin efectos secundarios.',
          role: 'admin',
          level: 'base',
          syntax: 'from paquete.modulo import funcion',
          code: `# utilidades.py
def normalizar(valor: str) -> str:
    return valor.strip().casefold()

# main.py
from utilidades import normalizar

print(normalizar("  WEB-01  "))`,
          points: [
            '`import modulo` importa el módulo; `from modulo import nombre` trae un nombre.',
            'Evita `from modulo import *`: contamina el espacio de nombres y oculta dependencias.',
            '`__name__` es `"__main__"` en el archivo ejecutado y el nombre del módulo al importarlo.',
            'Los imports se resuelven desde `sys.path`; ejecuta desde la raíz del proyecto o instala el paquete.',
          ],
          gotcha:
            'No pongas lógica pesada en el nivel superior de un módulo. Se ejecutará al importarlo y complicará los tests.',
        },
        {
          id: 'logging',
          title: 'logging estructurado',
          summary:
            '`print` sirve para aprender; `logging` sirve para operar. Niveles, formato y destinos configurables sin cambiar el código.',
          role: 'blue',
          level: 'intermedio',
          syntax: 'logging.basicConfig(...)',
          code: `import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

log = logging.getLogger("arsenal.scan")
log.info("inicio")
log.warning("host sin respuesta: %s", "10.0.0.5")
log.error("no se pudo escribir el informe")

try:
    1 / 0
except ZeroDivisionError:
    log.exception("fallo inesperado")`,
          points: [
            'INFO, WARNING, ERROR y CRITICAL permiten filtrar por importancia.',
            'Usa `%s` en el mensaje y pasa argumentos; el logging formatea solo si el nivel está activo.',
            '`log.exception()` incluye la traza y debe llamarse dentro de un `except`.',
            'No registres secretos, tokens ni datos personales completos.',
          ],
          gotcha:
            'No uses `logging.basicConfig()` en una librería: configura el logger de la aplicación, no el root global, para no secuestrar la configuración del usuario.',
        },
        {
          id: 'threading',
          title: 'threading e I/O concurrente',
          summary:
            'Los hilos son útiles para esperas de red o disco, no para CPU intensiva. Comparten memoria, así que necesitan sincronización.',
          role: 'red',
          level: 'avanzado',
          syntax: 'Thread(target=funcion).start()',
          code: `from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def comprobar(puerto: int) -> tuple[int, bool]:
    time.sleep(0.1)
    return puerto, puerto in {80, 443}

with ThreadPoolExecutor(max_workers=4) as pool:
    futuros = [pool.submit(comprobar, p) for p in [22, 80, 443, 8080]]
    for futuro in as_completed(futuros):
        puerto, abierto = futuro.result()
        print(puerto, "open" if abierto else "closed")`,
          points: [
            'El GIL limita la ejecución simultánea de bytecode Python, pero I/O libera el GIL.',
            '`ThreadPoolExecutor` gestiona el ciclo de vida de los hilos y recoge resultados.',
            'Protege el estado compartido con `Lock`, `Queue` o estructuras thread-safe.',
            'No lances miles de hilos; limita el pool y el timeout.',
          ],
          gotcha:
            'Un hilo no se puede matar de forma segura desde fuera. Diseña tareas cancelables con eventos y timeouts.',
        },
        {
          id: 'multiprocessing',
          title: 'multiprocessing para CPU',
          summary:
            'Los procesos evitan el GIL y aprovechan varios núcleos, a cambio de más memoria y comunicación por serialización.',
          role: 'admin',
          level: 'avanzado',
          syntax: 'Process(target=funcion, args=(...))',
          code: `from concurrent.futures import ProcessPoolExecutor

def calcular(n: int) -> int:
    return sum(i * i for i in range(n))

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=4) as pool:
        resultados = list(pool.map(calcular, [100_000, 200_000, 300_000]))
    print(resultados)`,
          points: [
            'El bloque `if __name__ == "__main__"` es obligatorio en Windows y buena práctica en Linux.',
            'Los argumentos y resultados deben ser serializables con pickle.',
            'La memoria no se comparte; cada proceso tiene su propio espacio.',
            'Para muchos datos, usa `shared_memory` o divide el trabajo en bloques.',
          ],
          gotcha:
            'No compartas una conexión de base de datos o un socket entre procesos sin un diseño explícito. Cada proceso necesita su propio recurso.',
        },
        {
          id: 'asyncio',
          title: 'asyncio: concurrencia cooperativa',
          summary:
            'asyncio maneja muchas operaciones de I/O en un solo hilo con `async`/`await`. No acelera CPU: evita bloquear mientras esperas.',
          role: 'network',
          level: 'avanzado',
          syntax: 'async def f(): await tarea()',
          code: `import asyncio

async def consultar(host: str) -> tuple[str, int]:
    await asyncio.sleep(0.1)
    return host, len(host)

async def main() -> None:
    resultados = await asyncio.gather(
        consultar("web-01"),
        consultar("db-01"),
        consultar("proxy-01"),
    )
    print(resultados)

if __name__ == "__main__":
    asyncio.run(main())`,
          points: [
            '`async def` define una corrutina; `await` cede el control mientras espera.',
            '`asyncio.run` crea el event loop y ejecuta la corrutina principal.',
            '`asyncio.gather` lanza varias tareas y espera sus resultados.',
            'No llames a funciones bloqueantes (`requests`, `time.sleep`) dentro de una corrutina sin `to_thread`.',
          ],
          gotcha:
            'Una corrutina sin `await` no se ejecuta. Si ves “coroutine was never awaited”, revisa dónde falta la espera.',
        },
        {
          id: 'senales',
          title: 'Señales y cierre ordenado',
          summary:
            'Un script de larga duración debe responder a SIGINT y SIGTERM, cerrar recursos y no dejar procesos hijos.',
          role: 'blue',
          level: 'avanzado',
          syntax: 'signal.signal(signal.SIGTERM, handler)',
          code: `import signal
import time

ejecutando = True

def detener(signum, frame):
    global ejecutando
    print(f"señal {signum}: cerrando")
    ejecutando = False

signal.signal(signal.SIGINT, detener)
signal.signal(signal.SIGTERM, detener)

while ejecutando:
    time.sleep(0.5)

print("salida ordenada")`,
          points: [
            'SIGINT corresponde a Ctrl+C; SIGTERM es la parada estándar de systemd y contenedores.',
            'El handler debe ser rápido: marca una bandera y deja que el flujo principal limpie.',
            'En asyncio, usa `loop.add_signal_handler` o maneja la cancelación de tareas.',
            'No ignores SIGTERM: el orquestador podría acabar matando el proceso con SIGKILL.',
          ],
          gotcha:
            'No hagas trabajo pesado dentro del handler de señal. Puede interrumpir una operación crítica y dejar el estado inconsistente.',
        },
        {
          id: 'secretos',
          title: 'Secretos y hashing',
          summary:
            'No guardes contraseñas en el código ni en argumentos visibles. Usa variables de entorno, permisos restrictivos y `secrets` para tokens.',
          role: 'red',
          level: 'intermedio',
          syntax: 'secrets.token_urlsafe(32)',
          code: `import hashlib
import hmac
import os
import secrets

token = secrets.token_urlsafe(32)
clave = os.environ.get("ARSENAL_API_KEY")
if not clave:
    raise SystemExit("falta ARSENAL_API_KEY")

firma = hmac.new(clave.encode(), b"mensaje", hashlib.sha256).hexdigest()
print("token:", token)
print("firma:", firma)`,
          points: [
            '`secrets` es criptográficamente seguro; `random` no lo es para tokens.',
            'Para contraseñas usa `hashlib.scrypt` o `argon2`; nunca SHA-256 simple.',
            'Compara firmas con `hmac.compare_digest` para evitar ataques de temporización.',
            'Pasa secretos por variables de entorno o un gestor, no por `argv` visible en `ps`.',
          ],
          gotcha:
            'No imprimas el secreto en logs ni en mensajes de error. Un token filtrado en un log sigue siendo un token válido.',
        },
        {
          id: 'calidad',
          title: 'Tests, tipos y análisis estático',
          summary:
            'Un script fiable se prueba. pytest, ruff, mypy y bandit convierten errores silenciosos en fallos visibles antes de producción.',
          role: 'admin',
          level: 'avanzado',
          syntax: 'python -m pytest',
          code: `# test_scope.py
from scope import normalizar

def test_normaliza_espacios():
    assert normalizar("  WEB-01 ") == "web-01"

def test_rechaza_vacio():
    import pytest
    with pytest.raises(ValueError):
        normalizar("   ")

# Ejecutar:
# python -m pytest -q
# ruff check .
# mypy .
# bandit -r .`,
          points: [
            'Los tests deben cubrir el camino feliz, entradas vacías y errores esperados.',
            '`pytest.raises` comprueba excepciones concretas.',
            'Ruff detecta estilo y errores comunes; mypy valida tipos; bandit busca patrones inseguros.',
            'Ejecuta estas comprobaciones en CI antes de desplegar.',
          ],
          gotcha:
            'No escribas tests que dependan de la red, de la hora o de un directorio concreto. Aísla el entorno con fixtures.',
        },
      ],
    },
  ],
  recipes: [
    {
      id: 'red-http',
      title: 'Red team: comprobación HTTP autorizada',
      role: 'red',
      summary:
        'Realiza una petición con timeout, registra estado y cabeceras relevantes, y no sigue redirecciones por defecto.',
      tags: ['http', 'reconocimiento', 'urllib'],
      code: `import argparse
import sys
import urllib.error
import urllib.request

def revisar(url: str, timeout: float = 5.0) -> int:
    peticion = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(peticion, timeout=timeout) as respuesta:
            print(f"estado={respuesta.status}")
            for cabecera in ("server", "content-type", "location"):
                valor = respuesta.headers.get(cabecera)
                if valor:
                    print(f"{cabecera}={valor}")
    except urllib.error.HTTPError as exc:
        print(f"estado={exc.code}")
    except urllib.error.URLError as exc:
        print(f"error={exc.reason}", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    args = parser.parse_args()
    raise SystemExit(revisar(args.url))`,
    },
    {
      id: 'red-parse',
      title: 'Red team: normalizar resultados de reconocimiento',
      role: 'red',
      summary:
        'Convierte líneas de texto en un inventario único y ordenado, descartando comentarios y duplicados.',
      tags: ['inventario', 'scope', 'json'],
      code: `import json
import sys
from pathlib import Path

def cargar(lineas: list[str]) -> dict[str, list[str]]:
    hosts: set[str] = set()
    urls: set[str] = set()
    for linea in lineas:
        valor = linea.strip()
        if not valor or valor.startswith("#"):
            continue
        if valor.startswith(("http://", "https://")):
            urls.add(valor)
        else:
            hosts.add(valor)
    return {"hosts": sorted(hosts), "urls": sorted(urls)}

datos = cargar(sys.stdin.readlines())
Path("inventario.json").write_text(
    json.dumps(datos, indent=2, ensure_ascii=False), encoding="utf-8"
)
print(f"hosts={len(datos['hosts'])} urls={len(datos['urls'])}")`,
    },
    {
      id: 'blue-log',
      title: 'Blue team: agrupar eventos por IP',
      role: 'blue',
      summary:
        'Lee logs JSON, tolera líneas corruptas y resume los eventos más frecuentes sin cargar todo en memoria.',
      tags: ['logs', 'detección', 'jsonl'],
      code: `import json
import sys
from collections import Counter
from pathlib import Path

def eventos(ruta: Path):
    with ruta.open(encoding="utf-8") as archivo:
        for numero, linea in enumerate(archivo, start=1):
            try:
                yield json.loads(linea)
            except json.JSONDecodeError:
                print(f"línea {numero}: JSON inválido", file=sys.stderr)

conteo = Counter(
    evento.get("ip", "desconocida")
    for evento in eventos(Path("eventos.jsonl"))
    if evento.get("tipo") == "login_failed"
)

for ip, total in conteo.most_common(10):
    print(f"{total:6d} {ip}")`,
    },
    {
      id: 'blue-ioc',
      title: 'Blue team: extraer IOCs de un texto',
      role: 'blue',
      summary:
        'Extrae IPv4, dominios y hashes con expresiones regulares, los deduplica y los guarda en JSON.',
      tags: ['ioc', 'regex', 'dfir'],
      code: `import json
import re
from pathlib import Path

TEXTO = Path("informe.txt").read_text(encoding="utf-8")
PATRONES = {
    "ipv4": r"\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
    "sha256": r"\\b[a-fA-F0-9]{64}\\b",
    "dominio": r"\\b(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}\\b",
}

resultado = {
    nombre: sorted(set(re.findall(patron, TEXTO)))
    for nombre, patron in PATRONES.items()
}
Path("iocs.json").write_text(
    json.dumps(resultado, indent=2, ensure_ascii=False), encoding="utf-8"
)
print(json.dumps(resultado, indent=2))`,
    },
    {
      id: 'admin-inventory',
      title: 'Sysadmin: inventario de servicios',
      role: 'admin',
      summary:
        'Ejecuta systemctl de forma segura, filtra unidades activas y genera un informe CSV reproducible.',
      tags: ['systemd', 'inventario', 'csv'],
      code: `import csv
import subprocess
from pathlib import Path

resultado = subprocess.run(
    ["systemctl", "list-units", "--type=service", "--no-legend", "--no-pager"],
    capture_output=True,
    text=True,
    check=True,
    timeout=10,
)

filas = []
for linea in resultado.stdout.splitlines():
    partes = linea.split()
    if len(partes) >= 4:
        filas.append({"unidad": partes[0], "estado": partes[3]})

with Path("servicios.csv").open("w", encoding="utf-8", newline="") as archivo:
    escritor = csv.DictWriter(archivo, fieldnames=["unidad", "estado"])
    escritor.writeheader()
    escritor.writerows(filas)

print(f"servicios={len(filas)}")`,
    },
    {
      id: 'admin-cleanup',
      title: 'Sysadmin: limpieza segura por antigüedad',
      role: 'admin',
      summary:
        'Borra solo archivos regulares de una ruta permitida, con modo dry-run por defecto y confirmación explícita.',
      tags: ['limpieza', 'pathlib', 'seguridad'],
      code: `import argparse
import time
from pathlib import Path

def limpiar(base: Path, dias: int, aplicar: bool) -> int:
    limite = time.time() - dias * 86400
    borrados = 0
    for ruta in base.rglob("*"):
        if not ruta.is_file() or ruta.is_symlink():
            continue
        if ruta.stat().st_mtime >= limite:
            continue
        print(("borrar " if aplicar else "dry-run ") + str(ruta))
        if aplicar:
            ruta.unlink()
            borrados += 1
    return borrados

parser = argparse.ArgumentParser()
parser.add_argument("ruta", type=Path)
parser.add_argument("--dias", type=int, default=30)
parser.add_argument("--aplicar", action="store_true")
args = parser.parse_args()

if not args.ruta.is_dir():
    raise SystemExit("ruta inválida")
print("total:", limpiar(args.ruta, args.dias, args.aplicar))`,
    },
    {
      id: 'network-check',
      title: 'Redes: comprobar puertos con sockets',
      role: 'network',
      summary:
        'Prueba TCP con timeout y resolución de nombres, sin depender de utilidades externas.',
      tags: ['socket', 'tcp', 'timeout'],
      code: `import socket
from concurrent.futures import ThreadPoolExecutor

def comprobar(host: str, puerto: int, timeout: float = 1.0) -> tuple[str, int, bool]:
    try:
        with socket.create_connection((host, puerto), timeout=timeout):
            return host, puerto, True
    except (OSError, TimeoutError):
        return host, puerto, False

hosts = ["127.0.0.1", "example.com"]
puertos = [22, 80, 443]
tareas = [(host, puerto) for host in hosts for puerto in puertos]

with ThreadPoolExecutor(max_workers=8) as pool:
    for host, puerto, abierto in pool.map(lambda x: comprobar(*x), tareas):
        if abierto:
            print(f"{host}:{puerto} open")`,
    },
    {
      id: 'network-http',
      title: 'Redes: medir latencia HTTP',
      role: 'network',
      summary:
        'Mide tiempo total y código de estado con urllib, registra fallos y calcula un resumen.',
      tags: ['http', 'latencia', 'métricas'],
      code: `import statistics
import sys
import time
import urllib.error
import urllib.request

URL = "https://example.com/health"
muestras = []

for intento in range(1, 6):
    inicio = time.perf_counter()
    try:
        with urllib.request.urlopen(URL, timeout=5) as respuesta:
            respuesta.read()
            estado = respuesta.status
    except urllib.error.URLError as exc:
        print(f"{intento}: error {exc.reason}", file=sys.stderr)
        continue
    duracion = time.perf_counter() - inicio
    muestras.append(duracion)
    print(f"{intento}: {estado} {duracion:.3f}s")

if muestras:
    print(f"media={statistics.mean(muestras):.3f}s p95≈{max(muestras):.3f}s")`,
    },
  ],
  references: [
    { label: 'Python 3 Documentation', url: 'https://docs.python.org/3/' },
    { label: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/' },
    { label: 'PEP 8 — Style Guide', url: 'https://peps.python.org/pep-0008/' },
    { label: 'argparse', url: 'https://docs.python.org/3/library/argparse.html' },
    { label: 'pathlib', url: 'https://docs.python.org/3/library/pathlib.html' },
    { label: 'asyncio', url: 'https://docs.python.org/3/library/asyncio.html' },
  ],
};
