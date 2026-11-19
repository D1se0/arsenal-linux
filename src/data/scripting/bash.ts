import type { ScriptManual } from './types';

export const BASH_MANUAL: ScriptManual = {
  id: 'bash',
  label: 'Bash',
  version: 'GNU Bash 5.x',
  accent: 'lime',
  headline: 'Del primer shebang a un script que puedes poner en producción.',
  description:
    'Manual progresivo de Bash scripting: sintaxis, quoting, variables, arrays, control de flujo, funciones, texto, procesos, señales y robustez. Cada tema incluye código ejecutable, explicación y un caso real por rol.',
  chapters: [
    {
      id: 'fundamentos',
      title: 'Fundamentos del intérprete',
      summary:
        'Cómo arranca Bash, cómo se ejecuta un script y cómo manejar variables, argumentos y redirecciones sin sorpresas.',
      topics: [
        {
          id: 'shebang',
          title: 'Shebang, permisos y ejecución',
          summary:
            'El shebang elige el intérprete. Los permisos deciden quién puede ejecutarlo. El modo estricto evita que un error pase desapercibido.',
          role: 'admin',
          level: 'base',
          syntax: '#!/usr/bin/env bash',
          code: `#!/usr/bin/env bash
set -euo pipefail

nombre="mundo"
printf 'Hola, %s\\n' "$nombre"`,
          output: 'Hola, mundo',
          points: [
            'Usa `#!/usr/bin/env bash` para respetar el Bash del PATH en lugar de fijar /bin/bash.',
            'Haz el archivo ejecutable con `chmod 750 script.sh`; después ejecútalo como `./script.sh`.',
            '`bash script.sh` no necesita permiso de ejecución, pero ignora el shebang.',
            'Ejecutar con `sh script.sh` puede cambiar el intérprete y romper arrays, `[[ ]]` o `set -o pipefail`.',
          ],
          gotcha:
            'Un script con CRLF de Windows puede fallar con “bad interpreter”. Convierte con `dos2unix` o `sed -i "s/\\r$//"`.',
        },
        {
          id: 'variables',
          title: 'Variables, constantes y sustitución aritmética',
          summary:
            'Bash no tiene tipos estáticos, pero sí convenciones: nombres en mayúsculas para entorno, minúsculas para locales y `readonly` para datos que no deben cambiar.',
          role: 'admin',
          level: 'base',
          syntax: 'nombre=valor',
          code: `readonly objetivo="10.0.0.10"
contador=0
contador=$((contador + 1))
mensaje="Host: $objetivo | intento: $contador"

printf '%s\\n' "$mensaje"`,
          output: 'Host: 10.0.0.10 | intento: 1',
          points: [
            'No dejes espacios alrededor del `=`: `nombre = valor` intenta ejecutar un comando llamado `nombre`.',
            '`$(( ... ))` evalúa aritmética entera; `$((16#ff))` interpreta hexadecimal y `$((2#1010))` binario.',
            '`readonly` impide reasignar la variable; `declare -r` hace lo mismo con una variable local.',
            'Para variables de entorno persistentes usa `export NOMBRE=valor`, preferiblemente desde un archivo de entorno controlado.',
          ],
          gotcha:
            'No uses `eval` para construir variables dinámicas. Casi siempre se resuelve con arrays asociativos o `printf -v`.',
        },
        {
          id: 'quoting',
          title: 'Quoting: la diferencia entre funcionar y explotar',
          summary:
            'Las comillas dobles preservan una cadena y permiten expansión; las simples son literales. Sin comillas, Bash divide palabras y expande globs.',
          role: 'admin',
          level: 'base',
          syntax: 'comando "$variable"',
          code: `ruta="/tmp/informe final.txt"

printf 'sin comillas: %s\\n' $ruta
printf 'con comillas: %s\\n' "$ruta"
printf 'literal: %s\\n' '$USER'
printf 'seguro: %s\\n' "\${ruta// /_}"`,
          output: 'sin comillas: /tmp/informe\nsin comillas: final.txt\ncon comillas: /tmp/informe final.txt\nliteral: $USER\nseguro: /tmp/informe_final.txt',
          points: [
            'Comillas dobles: expanden variables, comandos y aritmética, pero conservan los espacios.',
            'Comillas simples: no expanden nada. Ideales para expresiones regulares y plantillas literales.',
            '`"$@"` expande cada argumento por separado; `"$*"` los une en una sola palabra.',
            'Usa siempre `"$variable"` y `"$@"` salvo que necesites deliberadamente la división de palabras.',
          ],
          gotcha:
            'Un nombre de archivo con espacios, saltos de línea o `*` puede convertirse en varios argumentos. Ese es el origen de innumerables borrados accidentales.',
        },
        {
          id: 'argumentos',
          title: 'Argumentos posicionales y validación',
          summary:
            '`$0` es el script, `$1..$9` son argumentos, `$#` cuenta y `shift` los consume. Valida antes de tocar el sistema.',
          role: 'network',
          level: 'base',
          syntax: 'script.sh <host> <puerto>',
          code: `#!/usr/bin/env bash
set -euo pipefail

if (( $# < 2 )); then
  printf 'Uso: %s <host> <puerto>\\n' "$0" >&2
  exit 64
fi

host="$1"
puerto="$2"

[[ "$puerto" =~ ^[0-9]+$ ]] || {
  printf 'Puerto inválido: %s\\n' "$puerto" >&2
  exit 64
}

printf 'Objetivo: %s:%s\\n' "$host" "$puerto"`,
          points: [
            '`$#` es el número de argumentos; `(( $# < 2 ))` es la forma aritmética de comprobarlo.',
            'Los argumentos posteriores a `$9` se leen con `shift` o con `${10}` entre llaves.',
            '`$@` dentro de comillas dobles conserva cada argumento; `$*` los concatena con el primer carácter de `IFS`.',
            'Devuelve un código distinto de cero y escribe el uso en `stderr` cuando la entrada no sea válida.',
          ],
          gotcha:
            'No confíes en que un argumento sea una ruta, una IP o un número. Valida el formato y normaliza antes de usarlo en `rm`, `find` o `ssh`.',
        },
        {
          id: 'arrays',
          title: 'Arrays indexados',
          summary:
            'Un array guarda varios valores sin recurrir a cadenas separadas por espacios. Es la estructura correcta para listas de hosts, puertos o rutas.',
          role: 'admin',
          level: 'intermedio',
          syntax: 'nombre=(uno dos tres)',
          code: `puertos=(22 80 443)
puertos+=(8080)

for puerto in "\${puertos[@]}"; do
  printf 'probando %s\\n' "$puerto"
done

printf 'total=%s primero=%s\\n' "\${#puertos[@]}" "\${puertos[0]}"`,
          output: 'probando 22\nprobando 80\nprobando 443\nprobando 8080\ntotal=4 primero=22',
          points: [
            'Declara con paréntesis: `equipos=(web db proxy)`. Añade con `equipos+=(cache)`.',
            '`"${array[@]}"` expande todos los elementos sin volver a dividir cada uno.',
            '`${#array[@]}` cuenta elementos; `${#array[0]}` cuenta caracteres del primero.',
            'Puedes recorrer índices con `${!array[@]}` y eliminar un elemento con `unset "array[2]"`.',
          ],
          gotcha:
            '`for x in $array` vuelve a dividir por espacios. Usa `for x in "${array[@]}"` entre comillas.',
        },
        {
          id: 'asociativos',
          title: 'Arrays asociativos',
          summary:
            'Los arrays asociativos permiten mapear nombres a valores, por ejemplo servicio a puerto o usuario a rol, sin inventar delimitadores frágiles.',
          role: 'red',
          level: 'intermedio',
          syntax: 'declare -A mapa=([clave]=valor)',
          code: `declare -A servicios=(
  [ssh]=22
  [http]=80
  [https]=443
)

for nombre in "\${!servicios[@]}"; do
  printf '%-6s %s\\n' "$nombre" "\${servicios[$nombre]}"
done`,
          output: 'ssh    22\nhttp   80\nhttps  443',
          points: [
            'Requiere Bash 4 o superior. Comprueba la versión si el script debe correr en macOS antiguo.',
            '`${!mapa[@]}` devuelve las claves; `${mapa[clave]}` devuelve el valor.',
            'Las claves son cadenas, incluso si parecen números.',
            'Itera con `for clave in "${!mapa[@]}"` y cita siempre el valor al usarlo.',
          ],
          gotcha:
            'No uses `declare -A` dentro de una función sin `local` si no quieres contaminar el ámbito global.',
        },
        {
          id: 'redirecciones',
          title: 'Redirecciones y descriptores',
          summary:
            'stdout, stderr y stdin son descriptores. Saber separarlos permite guardar evidencia, silenciar ruido y depurar sin perder errores.',
          role: 'blue',
          level: 'base',
          syntax: 'comando > salida 2> errores',
          code: `./auditar.sh > salida.log 2> errores.log
./auditar.sh >> salida.log 2>&1
printf 'solo errores\\n' >&2

while IFS= read -r linea; do
  printf 'host: %s\\n' "$linea"
done < hosts.txt`,
          points: [
            '`>` sobrescribe; `>>` añade. `2>` redirige solo errores.',
            'El orden importa: `> archivo 2>&1` une ambos flujos; `2>&1 > archivo` no hace lo que parece.',
            '`< archivo` conecta un archivo a stdin; `<<< "$cadena"` usa un here-string.',
            '`/dev/null` descarta; `2>/dev/null` oculta errores, pero no los convierte en éxito.',
          ],
          gotcha:
            'Ocultar stderr durante una auditoría destruye evidencia. Si lo silencias, guarda el código de salida y deja una traza.',
        },
      ],
    },
    {
      id: 'control',
      title: 'Condiciones y control de flujo',
      summary:
        'if, case, operadores lógicos, aritmética y expresiones regulares. La base para que un script tome decisiones reproducibles.',
      topics: [
        {
          id: 'if',
          title: 'if / elif / else',
          summary:
            'La condición de `if` ejecuta un comando y evalúa su código de salida. `[[ ... ]]` es la forma recomendada en Bash.',
          role: 'admin',
          level: 'base',
          syntax: 'if [[ condición ]]; then ... fi',
          code: `archivo="/etc/hosts"

if [[ ! -r "$archivo" ]]; then
  printf 'No se puede leer %s\\n' "$archivo" >&2
  exit 1
elif [[ -d "$archivo" ]]; then
  printf '%s es un directorio\\n' "$archivo"
else
  printf 'OK: %s legible\\n' "$archivo"
fi`,
          points: [
            '`[[ ... ]]` es sintaxis de Bash: soporta `&&`, `||`, `=~` y patrones sin romper palabras.',
            'Los espacios son obligatorios: `[[ -f "$x" ]]`, no `[[-f"$x"]]`.',
            '`-f` archivo regular, `-d` directorio, `-r` lectura, `-w` escritura, `-x` ejecución, `-s` no vacío.',
            'Un `if` sin `else` es válido; si no hay rama, el script continúa con el siguiente comando.',
          ],
          gotcha:
            '`[ ... ]` es un comando y exige cuidado con comillas. Para lógica nueva en Bash usa siempre `[[ ... ]]`.',
        },
        {
          id: 'test-avanzado',
          title: 'Pruebas de archivos, cadenas y patrones',
          summary:
            'Combinar pruebas evita ramas duplicadas. Los patrones glob y las regex cubren casos que una comparación literal no resuelve.',
          role: 'blue',
          level: 'intermedio',
          syntax: '[[ -f "$ruta" && "$ruta" == *.log ]]',
          code: `ruta="/var/log/app.log"

if [[ -f "$ruta" && "$ruta" == *.log ]]; then
  printf 'log regular\\n'
fi

if [[ "$ruta" =~ /var/log/([^/]+)\\.log$ ]]; then
  printf 'servicio=%s\\n' "\${BASH_REMATCH[1]}"
fi`,
          output: 'log regular\nservicio=app',
          points: [
            '`==` compara cadenas; `=~` aplica una expresión regular extendida.',
            'En `=~`, no cites la regex: `[[ "$x" =~ ^[0-9]+$ ]]`; si la citas, se compara literalmente.',
            '`BASH_REMATCH[0]` es la coincidencia completa y `BASH_REMATCH[n]` los grupos.',
            '`-z` cadena vacía, `-n` cadena no vacía; `-v` comprueba si una variable está definida.',
          ],
          gotcha:
            'Las regex de Bash no son PCRE: no tienes `\\d`, lookarounds ni flags. Para eso usa `grep -P` o `perl`, no fuerces `[[ ]]`.',
        },
        {
          id: 'case',
          title: 'case: ramas limpias para acciones',
          summary:
            '`case` es más legible que una cadena de `elif` cuando comparas una misma variable contra varios patrones.',
          role: 'admin',
          level: 'base',
          syntax: 'case "$1" in patrón) ... ;; esac',
          code: `case "\${1:-}" in
  start|up)
    systemctl start app
    ;;
  stop|down)
    systemctl stop app
    ;;
  status)
    systemctl status app --no-pager
    ;;
  *)
    printf 'Uso: %s start|stop|status\\n' "$0" >&2
    exit 2
    ;;
esac`,
          points: [
            'Cada rama termina con `;;`; la última puede usar `;;` o `;&` si quieres fallthrough.',
            'Los patrones aceptan globs: `*.log`, `prod-*`, `[0-9]`.',
            'La rama `*)` captura todo lo demás y es el lugar correcto para mostrar el uso.',
            '`${1:-}` evita que `set -u` aborte cuando no se pasa ningún argumento.',
          ],
          gotcha:
            'No olvides el `;;` final de una rama: Bash puede seguir evaluando la siguiente y ejecutar dos acciones.',
        },
        {
          id: 'logicos',
          title: '&&, || y agrupación de comandos',
          summary:
            'Los operadores lógicos permiten encadenar acciones según el código de salida. Son útiles para una o dos comprobaciones, no para lógica compleja.',
          role: 'network',
          level: 'base',
          syntax: 'comando1 && comando2 || recuperar',
          code: `destino="/var/tmp/arsenal"

mkdir -p "$destino" \\
  && cp informe.txt "$destino/" \\
  || {
    printf 'fallo al preparar %s\\n' "$destino" >&2
    exit 1
  }

ping -c 1 -W 1 192.0.2.10 >/dev/null 2>&1 \\
  && printf 'host arriba\\n' \\
  || printf 'host sin respuesta\\n'`,
          points: [
            '`&&` ejecuta el segundo solo si el primero devuelve 0; `||` solo si devuelve distinto de 0.',
            '`A && B || C` no es un if/else perfecto: si B falla, C también se ejecuta.',
            'Agrupa con `{ ...; }` en el mismo shell o `( ... )` en un subshell.',
            'Un bloque `{ ...; }` necesita espacios y punto y coma antes de la llave de cierre.',
          ],
          gotcha:
            'Para lógica de tres o más ramas, usa `if`. Los encadenamientos largos ocultan qué condición falló.',
        },
        {
          id: 'aritmetica',
          title: 'Aritmética entera y contadores',
          summary:
            'Bash solo hace aritmética entera con `$(( ))` y `(( ))`. Para decimales, usa `awk`, `bc` o directamente Python.',
          role: 'red',
          level: 'base',
          syntax: '(( variable++ ))',
          code: `intentos=0
max=3

if (( intentos < max )); then
  intentos=$((intentos + 1))
fi

(( intentos == 1 )) && printf 'primer intento\\n'
printf '%s/%s\\n' "$intentos" "$max"`,
          output: 'primer intento\n1/3',
          points: [
            '`$(( ))` devuelve el resultado; `(( ))` evalúa y devuelve un código de salida.',
            'Dentro de `(( ))` no necesitas `$` para las variables: `(( total += puerto ))`.',
            'Soporta `++`, `--`, `+=`, `%=` y operadores bit a bit.',
            'En bash, `08` puede interpretarse como octal inválido. Usa `10#$valor` para forzar base 10.',
          ],
          gotcha:
            '`(( contador++ ))` devuelve 1 cuando el valor anterior era 0, lo que con `set -e` aborta el script. Usa `contador=$((contador + 1))`.',
        },
        {
          id: 'select',
          title: 'select: menús interactivos',
          summary:
            '`select` genera un menú numerado y deja la opción elegida en `REPLY` y en la variable indicada. Perfecto para herramientas internas.',
          role: 'admin',
          level: 'intermedio',
          syntax: 'select variable in opción1 opción2; do ... done',
          code: `PS3='Elige una opción: '

select accion in estado logs salir; do
  case "$accion" in
    estado)
      systemctl is-active app
      ;;
    logs)
      journalctl -u app -n 20 --no-pager
      ;;
    salir)
      break
      ;;
    *)
      printf 'Opción inválida: %s\\n' "\${REPLY:-}" >&2
      ;;
  esac
done`,
          points: [
            '`PS3` personaliza el prompt del menú.',
            'La variable recibe el texto de la opción; `REPLY` conserva el número introducido.',
            'El bucle termina con `break`; `Ctrl+D` también lo cierra.',
            'Valida siempre la opción por defecto: el usuario puede escribir cualquier cosa.',
          ],
          gotcha:
            'No uses `select` en un script no interactivo o dentro de cron: se quedará esperando entrada y bloqueará el proceso.',
        },
      ],
    },
    {
      id: 'bucles',
      title: 'Bucles y lectura de datos',
      summary:
        'for, while, until, read y control de iteraciones. La diferencia entre procesar una lista y perder líneas por una tubería.',
      topics: [
        {
          id: 'for',
          title: 'for sobre listas y arrays',
          summary:
            'El `for` de Bash recorre palabras o elementos. Con arrays, cita la expansión para no romper valores con espacios.',
          role: 'admin',
          level: 'base',
          syntax: 'for elemento in "${array[@]}"; do ... done',
          code: `hosts=(web-01 db-01 proxy-01)

for host in "\${hosts[@]}"; do
  printf 'revisando %s\\n' "$host"
  ssh -o BatchMode=yes -o ConnectTimeout=3 "$host" true \\
    && printf '  ok\\n' \\
    || printf '  sin acceso\\n'
done`,
          points: [
            'Sin `in`, `for` recorre los argumentos posicionales: `for arg; do ...; done`.',
            'Para archivos, no uses `for f in $(find ...)`: rompe nombres con espacios. Usa `find -print0` + `while read -d ""`.',
            '`for i in {1..10}` genera una secuencia; `{01..10}` conserva el ancho.',
            'Puedes iterar claves de un array asociativo con `${!mapa[@]}`.',
          ],
          gotcha:
            'Un glob sin comillas puede expandirse a miles de archivos y superar el límite de argumentos. Usa `find` o `nullglob` consciente.',
        },
        {
          id: 'for-c',
          title: 'for estilo C',
          summary:
            'La sintaxis de tres expresiones es útil para contadores numéricos y para recorrer índices de un array.',
          role: 'network',
          level: 'base',
          syntax: 'for ((i=0; i<n; i++)); do ... done',
          code: `puertos=(22 80 443)

for ((i = 0; i < \${#puertos[@]}; i++)); do
  printf '%d/%d -> %s\\n' "$((i + 1))" "\${#puertos[@]}" "\${puertos[$i]}"
done

for ((intento = 1; intento <= 3; intento++)); do
  printf 'intento %d\\n' "$intento"
done`,
          points: [
            'Inicialización, condición e incremento se separan con `;` dentro de `(( ))`.',
            'La variable de control es global salvo que uses `local` en una función.',
            'Puedes omitir partes: `for ((;;))` es un bucle infinito deliberado.',
            'Para recorrer índices, `${#array[@]}` da el total y `${array[i]}` el elemento.',
          ],
          gotcha:
            'Modificar el array mientras lo recorres por índice puede saltarte elementos. Recorre una copia si vas a borrar.',
        },
        {
          id: 'while',
          title: 'while: condición al principio',
          summary:
            '`while` repite mientras la condición sea verdadera. Es la estructura natural para esperar servicios, leer archivos y procesar tuberías.',
          role: 'blue',
          level: 'base',
          syntax: 'while condición; do ... done',
          code: `intentos=0

while ! curl -fsS http://127.0.0.1:8080/health >/dev/null; do
  intentos=$((intentos + 1))
  if (( intentos >= 10 )); then
    printf 'servicio no disponible tras %d intentos\\n' "$intentos" >&2
    exit 1
  fi
  sleep 2
done

printf 'servicio listo tras %d intentos\\n' "$intentos"`,
          points: [
            'La condición puede ser cualquier comando; `!` invierte su código de salida.',
            'Incluye siempre un límite o un timeout para evitar bucles infinitos.',
            '`sleep` acepta decimales en GNU coreutils: `sleep 0.5`.',
            'Dentro de una tubería, el `while` corre en un subshell y sus variables no siempre sobreviven.',
          ],
          gotcha:
            '`cmd | while read ...` no modifica variables del shell padre. Usa `while ... done < <(cmd)` o `mapfile`.',
        },
        {
          id: 'until',
          title: 'until: repite hasta que ocurra',
          summary:
            '`until` es el inverso de `while`: itera mientras la condición sea falsa. Se lee mejor cuando esperas un éxito.',
          role: 'network',
          level: 'base',
          syntax: 'until comando; do ... done',
          code: `limite=15
espera=0

until nc -z 10.0.0.20 443 2>/dev/null; do
  if (( espera >= limite )); then
    printf 'puerto 443 no responde\\n' >&2
    exit 1
  fi
  espera=$((espera + 1))
  sleep 1
done

printf 'puerto 443 disponible\\n'`,
          points: [
            'La condición se evalúa antes de cada iteración, igual que en `while`.',
            'Es equivalente a `while ! comando`, pero más explícito cuando el éxito es el objetivo.',
            'Combínalo con contadores y `sleep` para no martillear un servicio.',
            '`nc -z` solo comprueba TCP; no garantiza que la aplicación responda correctamente.',
          ],
          gotcha:
            'Un `until` sin límite puede quedarse esperando para siempre si el puerto nunca abre. En producción, añade timeout y logging.',
        },
        {
          id: 'read',
          title: 'read línea a línea sin perder datos',
          summary:
            '`while IFS= read -r` es el patrón canónico para procesar texto. Conserva espacios y backslashes, y no depende del tamaño del archivo.',
          role: 'red',
          level: 'intermedio',
          syntax: 'while IFS= read -r linea; do ...; done < archivo',
          code: `while IFS= read -r linea || [[ -n "$linea" ]]; do
  [[ -z "$linea" || "$linea" == \\#* ]] && continue
  printf 'objetivo=%s\\n' "$linea"
done < scope.txt`,
          points: [
            '`IFS=` evita que se recorten espacios al principio y al final.',
            '`-r` impide que la barra invertida se interprete como escape.',
            '`|| [[ -n "$linea" ]]` procesa una última línea sin salto final.',
            '`read -d ""` lee cadenas terminadas en NUL, ideal para `find -print0`.',
          ],
          gotcha:
            'No uses `for linea in $(cat archivo)`: divide por espacios y expande globs. El patrón correcto es `while read`.',
        },
        {
          id: 'break-continue',
          title: 'break, continue y bucles anidados',
          summary:
            '`break` sale del bucle; `continue` salta a la siguiente iteración. En bucles anidados puedes indicar cuántos niveles romper.',
          role: 'admin',
          level: 'intermedio',
          syntax: 'break 2',
          code: `for entorno in prod staging; do
  for host in web-01 web-02 db-01; do
    if [[ "$host" == db-* && "$entorno" == staging ]]; then
      printf 'saltando %s en %s\\n' "$host" "$entorno"
      continue
    fi
    if [[ "$host" == web-02 && "$entorno" == prod ]]; then
      printf 'cortando búsqueda en %s\\n' "$entorno"
      break 2
    fi
    printf '%s/%s revisado\\n' "$entorno" "$host"
  done
done`,
          points: [
            '`continue` no ejecuta el resto del cuerpo, pero vuelve a evaluar la condición.',
            '`break 2` sale de dos bucles anidados; sin número sale solo del más interno.',
            'En `select`, `break` cierra el menú y `continue` vuelve a mostrarlo.',
          ],
          gotcha:
            'Un `continue` dentro de un `case` puede confundirse con el `;;` de la rama. Revisa la indentación y el flujo real.',
        },
      ],
    },
    {
      id: 'funciones',
      title: 'Funciones y parámetros',
      summary:
        'Funciones con ámbito local, retorno por código de salida, getopts, shift y referencias indirectas. Cómo dividir un script sin convertirlo en una cadena de variables globales.',
      topics: [
        {
          id: 'funcion-local',
          title: 'Funciones y variables locales',
          summary:
            'Una función encapsula lógica y puede declarar variables locales. Sin `local`, cualquier asignación contamina el shell global.',
          role: 'admin',
          level: 'base',
          syntax: 'funcion() { local var=valor; ... }',
          code: `saludar() {
  local nombre="\${1:-mundo}"
  printf 'Hola, %s\\n' "$nombre"
}

saludar
saludar "equipo SOC"`,
          output: 'Hola, mundo\nHola, equipo SOC',
          points: [
            'Declara funciones con `nombre() { ...; }` o `function nombre { ...; }`.',
            '`local` solo funciona dentro de una función; fuera de ella es un error en muchos shells.',
            'Las variables locales se heredan por las funciones llamadas, pero no vuelven al ámbito superior al terminar.',
            'Usa `local -r` para constantes locales y `local -a` para arrays.',
          ],
          gotcha:
            'No uses `local var=$(comando)` sin comprobar el estado: el código de salida de `local` enmascara el del comando. Declara y asigna por separado.',
        },
        {
          id: 'return',
          title: 'return y códigos de salida',
          summary:
            'Las funciones de shell no devuelven objetos: devuelven un código de 0 a 255. Para devolver datos, usa stdout o una variable global controlada.',
          role: 'blue',
          level: 'intermedio',
          syntax: 'return 0 | return 1',
          code: `existe_host() {
  local host="$1"
  getent hosts "$host" >/dev/null 2>&1
}

if existe_host "api.internal"; then
  printf 'resuelve\\n'
else
  printf 'no resuelve\\n' >&2
  exit 1
fi`,
          points: [
            '`return 0` significa éxito; `1-255` indica fallo. `return` sin valor usa el último comando.',
            'Puedes devolver datos por stdout y capturarlos con `resultado=$(funcion)`.',
            'Evita `echo` para mensajes de error dentro de una función que se captura: usa `stderr`.',
            'El código de salida de la función es el del último comando si no hay `return` explícito.',
          ],
          gotcha:
            'No uses `return` para devolver una cadena. En Bash, `return "texto"` genera un error de valor numérico.',
        },
        {
          id: 'funcion-args',
          title: 'Argumentos dentro de funciones',
          summary:
            'Dentro de una función, `$1`, `$@` y `$#` se refieren a sus propios argumentos, no a los del script.',
          role: 'network',
          level: 'intermedio',
          syntax: 'funcion "$arg1" "$arg2"',
          code: `probar_puerto() {
  local host="$1"
  local puerto="$2"
  local timeout="\${3:-2}"

  if [[ -z "$host" || -z "$puerto" ]]; then
    printf 'faltan host o puerto\\n' >&2
    return 64
  fi

  nc -z -w "$timeout" "$host" "$puerto"
}

probar_puerto 10.0.0.5 443 || printf 'cerrado\\n'`,
          points: [
            'Pasa siempre los argumentos entre comillas: `funcion "$host" "$puerto"`.',
            '`"$@"` dentro de la función conserva todos los argumentos recibidos.',
            'Puedes usar valores por defecto con `${3:-2}` y validar antes de llamar a herramientas externas.',
            '`$FUNCNAME` contiene el nombre de la función actual; es útil para logging.',
          ],
          gotcha:
            'No uses variables globales para pasar parámetros silenciosamente. La función deja de ser reusable y se vuelve difícil de probar.',
        },
        {
          id: 'getopts',
          title: 'getopts: flags de verdad',
          summary:
            '`getopts` parsea opciones cortas y sus argumentos. Para flags largas, usa un `while` manual o una herramienta como Python argparse.',
          role: 'admin',
          level: 'avanzado',
          syntax: 'while getopts ":h:p:v" opt; do ... done',
          code: `uso() {
  printf 'Uso: %s -h host -p puerto [-v]\\n' "$0" >&2
}

host=""
puerto=""
verbose=0

while getopts ":h:p:v" opt; do
  case "$opt" in
    h) host="$OPTARG" ;;
    p) puerto="$OPTARG" ;;
    v) verbose=1 ;;
    :) printf 'Falta valor para -%s\\n' "$OPTARG" >&2; uso; exit 64 ;;
    \\?) printf 'Opción inválida: -%s\\n' "$OPTARG" >&2; uso; exit 64 ;;
  esac
done

printf 'host=%s puerto=%s verbose=%s\\n' "$host" "$puerto" "$verbose"`,
          points: [
            'El primer `:` de `":h:p:v"` activa el modo silencioso; el segundo indica que `h` y `p` llevan argumento.',
            '`OPTARG` contiene el valor de la opción; `OPTIND` apunta al siguiente argumento.',
            'Después del bucle, usa `shift $((OPTIND - 1))` para procesar argumentos posicionales.',
            '`getopts` no soporta `--long-option` de forma nativa.',
          ],
          gotcha:
            'Si olvidas el `shift` después del bucle, los flags se procesan otra vez como argumentos posicionales.',
        },
        {
          id: 'shift',
          title: 'shift y procesamiento posicional',
          summary:
            '`shift` descarta el primer argumento y mueve el resto. Es útil para consumir flags o procesar listas variables.',
          role: 'red',
          level: 'intermedio',
          syntax: 'shift [n]',
          code: `objetivo="$1"
shift

if (( $# == 0 )); then
  printf 'No hay puertos para %s\\n' "$objetivo" >&2
  exit 64
fi

for puerto in "$@"; do
  printf '%s:%s\\n' "$objetivo" "$puerto"
done`,
          points: [
            '`shift` sin argumento descarta uno; `shift 2` descarta dos.',
            'Después de `shift`, `$1` es el antiguo `$2` y `$#` disminuye.',
            'Comprueba `$#` antes de hacer `shift` para no quedarte sin argumentos.',
            'Puedes combinar `getopts` + `shift $((OPTIND - 1))` para separar flags de operandos.',
          ],
          gotcha:
            'No hagas `shift` dentro de un bucle que también recorre `"$@"`; estarás modificando la lista mientras la lees.',
        },
        {
          id: 'nameref',
          title: 'nameref y referencias indirectas',
          summary:
            '`declare -n` crea una referencia a otra variable. Sirve para modificar arrays o valores desde una función sin usar `eval`.',
          role: 'admin',
          level: 'avanzado',
          syntax: 'local -n ref="$1"',
          code: `rellenar() {
  local -n destino="$1"
  destino+=("$2")
}

hosts=()
rellenar hosts "web-01"
rellenar hosts "db-01"

printf '%s\\n' "\${hosts[@]}"`,
          output: 'web-01\ndb-01',
          points: [
            'Requiere Bash 4.3 o superior.',
            'La referencia se declara con `local -n` o `declare -n`.',
            'Al asignar a la referencia, modificas la variable original.',
            'Es la alternativa segura a `eval` para devolver arrays desde una función.',
          ],
          gotcha:
            'No referencies una variable con el mismo nombre que la referencia: crearás un ciclo y Bash fallará.',
        },
      ],
    },
    {
      id: 'texto',
      title: 'Texto, arrays y datos',
      summary:
        'Expansión de parámetros, IFS, printf, mapfile, here-docs y sustitución de procesos. Las herramientas que convierten Bash en un lenguaje de datos usable.',
      topics: [
        {
          id: 'expansion',
          title: 'Expansión de parámetros',
          summary:
            'Bash puede quitar prefijos, sufijos, sustituir texto y aplicar valores por defecto sin llamar a `sed` ni `awk`.',
          role: 'admin',
          level: 'intermedio',
          syntax: '${variable##patrón}',
          code: `ruta="/var/log/nginx/access.log.gz"
archivo="\${ruta##*/}"
sin_gz="\${archivo%.gz}"
base="\${sin_gz%.log}"

printf 'archivo=%s\\n' "$archivo"
printf 'sin gz=%s\\n' "$sin_gz"
printf 'base=%s\\n' "$base"
printf 'vacío=%s\\n' "\${NO_EXISTE:-valor-por-defecto}"`,
          output: 'archivo=access.log.gz\nsin gz=access.log\nbase=access\nvacío=valor-por-defecto',
          points: [
            '`${var#patrón}` quita el prefijo más corto; `##` el más largo.',
            '`${var%patrón}` quita el sufijo más corto; `%%` el más largo.',
            '`${var:-default}` usa un valor si está vacío o no definido; `${var:=default}` además lo asigna.',
            '`${var/old/new}` sustituye la primera coincidencia; `${var//old/new}` todas.',
          ],
          gotcha:
            'Escapa los patrones que contienen globs si quieres que sean literales. `#` y `%` operan con patrones, no con índices.',
        },
        {
          id: 'ifs',
          title: 'IFS y lectura de campos',
          summary:
            '`IFS` define los separadores que usa `read` y la expansión de palabras. Cambiarlo sin restaurarlo es una fuente clásica de bugs.',
          role: 'red',
          level: 'intermedio',
          syntax: 'IFS=, read -r campo1 campo2',
          code: `while IFS=, read -r usuario rol host; do
  [[ -z "$usuario" ]] && continue
  printf 'usuario=%s rol=%s host=%s\\n' "$usuario" "$rol" "$host"
done <<'CSV'
ana,admin,web-01
luis,analista,db-01
CSV`,
          points: [
            '`IFS=,` afecta solo al comando `read` de esa línea; no contamina el resto del script.',
            'El último campo recibe el resto de la línea, aunque contenga el separador.',
            '`IFS=$"\\n"` no es una forma fiable de separar líneas; usa `read` línea a línea.',
            'Guarda el IFS anterior si necesitas cambiarlo globalmente: `old=$IFS; IFS=:; ...; IFS=$old`.',
          ],
          gotcha:
            'No cambies `IFS` de forma global al principio de un script. Romperá `"$@"`, `read` y muchas expansiones inesperadamente.',
        },
        {
          id: 'printf',
          title: 'printf con formato',
          summary:
            '`printf` es más predecible que `echo`: no interpreta flags del shell, permite anchos, precisión y reutiliza el formato para varios argumentos.',
          role: 'admin',
          level: 'base',
          syntax: 'printf "%-10s %s\\n" "$nombre" "$valor"',
          code: `printf '%-12s %8s\\n' 'SERVICIO' 'PUERTO'
printf '%-12s %8d\\n' 'ssh' 22
printf '%-12s %8d\\n' 'https' 443
printf 'hex=%#x octal=%#o\\n' 255 8`,
          output: 'SERVICIO        PUERTO\nssh                 22\nhttps              443\nhex=0xff octal=010',
          points: [
            '`%s` cadena, `%d` entero, `%f` flotante, `%x` hexadecimal, `%q` forma reutilizable por shell.',
            '`%-12s` alinea a la izquierda en 12 caracteres; `%08d` rellena con ceros.',
            'Si hay más argumentos que especificadores, `printf` reutiliza el formato.',
            'Usa `printf -v variable` para asignar el resultado sin subshell.',
          ],
          gotcha:
            'No pases datos no confiables como formato: `printf "$input"` interpreta `%` y puede corromper la salida. Usa `printf "%s" "$input"`.',
        },
        {
          id: 'mapfile',
          title: 'mapfile y readarray',
          summary:
            '`mapfile` lee líneas completas en un array sin bucles ni pérdida de espacios. Es la forma rápida de cargar un archivo en memoria.',
          role: 'blue',
          level: 'intermedio',
          syntax: 'mapfile -t lineas < archivo',
          code: `mapfile -t hosts < hosts.txt

printf 'hosts cargados: %d\\n' "\${#hosts[@]}"
for host in "\${hosts[@]}"; do
  printf 'revisando %s\\n' "$host"
done`,
          points: [
            '`-t` elimina el salto de línea final de cada elemento.',
            'Sin `-t`, cada línea conserva el `\\n` y las comparaciones fallan.',
            '`-n 10` limita el número de líneas; `-s 1` salta la primera.',
            'Puedes sustituir la entrada con `< <(comando)` para cargar la salida de otro proceso.',
          ],
          gotcha:
            'Un archivo enorme consume memoria. Para millones de líneas, procesa en streaming con `while read`.',
        },
        {
          id: 'heredoc',
          title: 'Here-docs y here-strings',
          summary:
            'Los here-docs escriben bloques multilínea sin concatenar echos. Cita el delimitador si no quieres que Bash expanda variables.',
          role: 'network',
          level: 'base',
          syntax: 'cat <<EOF > archivo',
          code: `cat <<'CONFIG' > /tmp/scope.conf
target=10.0.0.0/24
ports=22,80,443
rate=50
CONFIG

mensaje="hola"
cat <<EOF
valor: $mensaje
fecha: $(date +%F)
EOF`,
          points: [
            '`<<EOF` expande variables y comandos; `<<\'EOF\'` entrega el texto literal.',
            'Puedes usar `<<-EOF` para eliminar tabulaciones iniciales, no espacios.',
            'Un here-string `<<< "$cadena"` añade un salto de línea y lo conecta a stdin.',
            'Cierra el delimitador exactamente, sin espacios delante salvo con `<<-`.',
          ],
          gotcha:
            'Si el delimitador aparece dentro del contenido sin comillas, el here-doc termina antes de lo previsto. Usa un token único como `CONFIG_EOF`.',
        },
        {
          id: 'process-substitution',
          title: 'Sustitución de procesos',
          summary:
            '`<(comando)` y `>(comando)` convierten la salida o entrada de un proceso en una ruta temporal tipo archivo. Evitan tuberías que crean subshells.',
          role: 'blue',
          level: 'avanzado',
          syntax: 'diff <(comando1) <(comando2)',
          code: `diff -u \\
  <(sort usuarios-before.txt) \\
  <(sort usuarios-after.txt) \\
  > cambios.diff || true

while IFS= read -r linea; do
  printf 'evento: %s\\n' "$linea"
done < <(journalctl -u app -n 5 --no-pager -o cat)`,
          points: [
            '`<(comando)` se expande a una ruta como `/dev/fd/63`; el proceso se ejecuta en paralelo.',
            'Es ideal para `diff`, `comm` y `join` con datos generados al vuelo.',
            '`done < <(comando)` mantiene el bucle en el shell actual y conserva las variables.',
            'No funciona en todos los shells POSIX; es una extensión de Bash, Zsh y Ksh.',
          ],
          gotcha:
            'No uses `|` cuando necesites conservar contadores o arrays del bucle. La sustitución de procesos evita ese subshell.',
        },
        {
          id: 'datos-externos',
          title: 'Procesar JSON y CSV sin inventar parsers',
          summary:
            'Bash no parsea JSON de forma nativa. Para datos estructurados, delega en `jq` o `python3`; no uses `grep` y `cut` como si fueran un parser.',
          role: 'red',
          level: 'intermedio',
          syntax: 'jq -r \'.campo\' datos.json',
          code: `jq -r '.hosts[] | select(.activo) | [.nombre, .ip] | @tsv' inventario.json |
while IFS=$'\\t' read -r nombre ip; do
  printf '%-10s %s\\n' "$nombre" "$ip"
done

python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["version"])' < datos.json`,
          points: [
            '`jq -e` devuelve un código de error si el filtro no produce un valor útil.',
            'Usa `@tsv` o `@csv` para que las comillas y escapes se gestionen correctamente.',
            'Para CSV complejo, usa el módulo `csv` de Python: las comillas y saltos internos rompen `cut`.',
            'Valida el JSON antes de confiar en sus campos: `jq empty archivo.json`.',
          ],
          gotcha:
            'No uses `eval` para convertir JSON en variables. Un campo malicioso puede ejecutar comandos.',
        },
      ],
    },
    {
      id: 'robustez',
      title: 'Robustez, procesos y referencia',
      summary:
        'Modo estricto, trampas, temporales, locks, trabajos y logging. Lo que separa un script de laboratorio de uno que puedes dejar en cron.',
      topics: [
        {
          id: 'strict-mode',
          title: 'set -euo pipefail',
          summary:
            'El modo estricto aborta ante errores, variables sin definir y fallos dentro de tuberías. No es una bala de plata, pero elimina clases enteras de bugs.',
          role: 'admin',
          level: 'intermedio',
          syntax: 'set -euo pipefail',
          code: `#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'

temporal="$(mktemp)"
trap 'rm -f "$temporal"' EXIT

curl -fsS https://example.com/inventario.json -o "$temporal"
jq -e '.hosts | length > 0' "$temporal" >/dev/null`,
          points: [
            '`-e` termina ante un comando fallido; `-u` error si se usa una variable no definida; `-o pipefail` propaga fallos de cualquier parte de la tubería.',
            '`-e` no se activa en condiciones `if`, `while`, `&&` o `||`, ni en el comando a la izquierda de una tubería sin `pipefail`.',
            '`set -x` traza los comandos; úsalo solo en depuración porque puede filtrar secretos.',
            'Puedes desactivar temporalmente con `set +e` y volver a activar con `set -e`, pero justifícalo.',
          ],
          gotcha:
            'Con `set -e`, una función que termina en `grep` sin coincidencias puede abortar el script. Comprueba el código o usa `grep ... || true` de forma deliberada.',
        },
        {
          id: 'trap',
          title: 'trap: limpieza y señales',
          summary:
            '`trap` ejecuta una rutina al recibir una señal o al terminar el script. Es obligatorio para borrar temporales y cerrar túneles.',
          role: 'blue',
          level: 'avanzado',
          syntax: 'trap "limpiar" EXIT INT TERM',
          code: `tmpdir="$(mktemp -d)"
tunel_pid=""

limpiar() {
  local estado=$?
  [[ -n "$tunel_pid" ]] && kill "$tunel_pid" 2>/dev/null || true
  rm -rf -- "$tmpdir"
  exit "$estado"
}

trap limpiar EXIT INT TERM

printf 'trabajando en %s\\n' "$tmpdir"
sleep 30 &
tunel_pid=$!
wait "$tunel_pid"`,
          points: [
            '`EXIT` cubre salida normal y errores; `INT` y `TERM` cubren interrupciones.',
            'Guarda `$?` al inicio de la función de limpieza para no perder el código original.',
            'Usa `kill` y `wait` para cerrar procesos hijos; no dejes túneles abiertos.',
            '`trap - EXIT` elimina la trampa si ya no la necesitas.',
          ],
          gotcha:
            'Un `trap` que llama a `exit` dentro de otro `trap` puede recursarse. Usa una bandera o elimina la trampa antes de salir.',
        },
        {
          id: 'mktemp',
          title: 'Temporales seguros con mktemp',
          summary:
            'Nunca uses `/tmp/miarchivo` con un nombre predecible. `mktemp` crea un archivo o directorio único con permisos restrictivos.',
          role: 'admin',
          level: 'base',
          syntax: 'mktemp [-d]',
          code: `archivo="$(mktemp)"
directorio="$(mktemp -d)"
trap 'rm -f -- "$archivo"; rm -rf -- "$directorio"' EXIT

printf 'datos\\n' > "$archivo"
chmod 600 "$archivo"
printf 'temp=%s dir=%s\\n' "$archivo" "$directorio"`,
          points: [
            '`mktemp` crea el archivo con modo 600 y un nombre aleatorio.',
            '`mktemp -d` crea un directorio temporal; ideal para extraer archivos.',
            'Puedes pedir una plantilla: `mktemp /var/tmp/arsenal.XXXXXX`.',
            'Limpia siempre con `trap`; un script que falla no debe dejar basura ni datos sensibles.',
          ],
          gotcha:
            'No uses `mktemp` con una ruta que no exista o sin permisos: el script seguirá con una variable vacía si no compruebas el resultado.',
        },
        {
          id: 'flock',
          title: 'flock: evita ejecuciones simultáneas',
          summary:
            'Un lock impide que dos copias del script se pisen. Es esencial en cron, backups y tareas que modifican el mismo recurso.',
          role: 'red',
          level: 'avanzado',
          syntax: 'exec 9>/run/lock/app.lock; flock -n 9',
          code: `lock="/run/lock/arsenal-scan.lock"
exec 9>"$lock"

if ! flock -n 9; then
  printf 'Ya hay una ejecución en curso\\n' >&2
  exit 75
fi

printf 'lock adquirido por %s\\n' "$$"
sleep 2`,
          points: [
            '`flock -n` falla inmediatamente si el lock está tomado; sin `-n` espera.',
            'El descriptor 9 se cierra al terminar el script y libera el lock automáticamente.',
            'El archivo de lock debe estar en una ruta escribible y persistente.',
            '`flock` es de util-linux; comprueba disponibilidad en sistemas mínimos.',
          ],
          gotcha:
            'No pongas el lock dentro de `/tmp` si otros usuarios pueden borrarlo. Usa `/run/lock` o un directorio propio con permisos correctos.',
        },
        {
          id: 'jobs',
          title: 'Trabajos en segundo plano y wait',
          summary:
            'Bash puede lanzar procesos en background, guardar sus PID y esperar a que terminen. Así paralelizas sin perder el control.',
          role: 'admin',
          level: 'intermedio',
          syntax: 'comando & pids+=($!); wait',
          code: `pids=()

for host in web-01 web-02 db-01; do
  ping -c 1 -W 1 "$host" >/dev/null 2>&1 &
  pids+=("$!")
done

for pid in "\${pids[@]}"; do
  wait "$pid" || printf 'falló el proceso %s\\n' "$pid" >&2
done

printf 'ronda completada\\n'`,
          points: [
            '`$!` contiene el PID del último proceso lanzado en background.',
            '`wait` sin argumentos espera a todos los hijos; `wait "$pid"` espera a uno concreto.',
            'Guarda los PID en un array para poder cancelarlos en un `trap`.',
            'Demasiados procesos simultáneos pueden agotar descriptores o saturar la red.',
          ],
          gotcha:
            '`wait` devuelve el código del proceso esperado, pero si el proceso ya terminó puede seguir siendo consultable. No asumas que el orden de finalización es el de lanzamiento.',
        },
        {
          id: 'retry',
          title: 'Reintentos con backoff',
          summary:
            'No todos los fallos son permanentes. Un reintento acotado con espera progresiva resuelve fallos transitorios sin ocultar errores reales.',
          role: 'network',
          level: 'avanzado',
          syntax: 'for intento in {1..5}; do ...; sleep $((intento * 2)); done',
          code: `reintentar() {
  local intento
  for intento in 1 2 3 4 5; do
    if "$@"; then
      return 0
    fi
    if (( intento < 5 )); then
      sleep "$((intento * 2))"
    fi
  done
  return 1
}

reintentar curl -fsS https://example.com/health`,
          points: [
            'Limita el número de intentos y el tiempo total; un reintento infinito puede convertirse en un ataque de disponibilidad.',
            'Añade jitter aleatorio si muchos clientes reintentan a la vez.',
            'Registra cada fallo con el comando y el código de salida.',
            'Solo reintenta errores transitorios: un 401 o un 404 no se arregla esperando.',
          ],
          gotcha:
            'No reintentes operaciones no idempotentes sin control: una transferencia o un pago puede ejecutarse dos veces.',
        },
        {
          id: 'logging',
          title: 'Logging estructurado en Bash',
          summary:
            'Un log útil incluye fecha, nivel, script y mensaje. Escribe errores a stderr y evita imprimir secretos o datos personales.',
          role: 'blue',
          level: 'intermedio',
          syntax: 'log() { printf ... >&2; }',
          code: `log() {
  local nivel="$1"
  shift
  printf '%s [%s] %s: %s\\n' \\
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \\
    "$nivel" \\
    "\${FUNCNAME[1]:-main}" \\
    "$*" >&2
}

log INFO "inicio del análisis"
log WARN "objetivo sin respuesta"
log ERROR "no se pudo escribir el informe"`,
          points: [
            'Escribe logs en stderr para no contaminar la salida de datos que otro comando pueda consumir.',
            'Usa UTC (`date -u`) y formato ISO 8601 para que los eventos se puedan ordenar.',
            'Incluye el nombre de la función con `${FUNCNAME[1]:-main}`.',
            'No registres tokens, contraseñas ni contenido de archivos sensibles.',
          ],
          gotcha:
            'Un log dentro de una función que devuelve datos por stdout romperá la captura. Envía siempre los mensajes a `stderr`.',
        },
      ],
    },
  ],
  recipes: [
    {
      id: 'red-scope',
      title: 'Red team: inventario de alcance autorizado',
      role: 'red',
      summary:
        'Normaliza un scope, valida que no esté vacío y genera una lista reproducible antes de lanzar cualquier prueba.',
      tags: ['scope', 'validación', 'évidencia'],
      code: `#!/usr/bin/env bash
set -euo pipefail

entrada="\${1:?uso: $0 scope.txt}"
salida="scope-limpio.txt"

[[ -r "$entrada" ]] || { printf 'no se puede leer %s\\n' "$entrada" >&2; exit 1; }

awk '
  /^[[:space:]]*#/ { next }
  /^[[:space:]]*$/ { next }
  { gsub(/[[:space:]]/, ""); print }
' "$entrada" | sort -u > "$salida"

[[ -s "$salida" ]] || { printf 'scope vacío\\n' >&2; exit 1; }
printf 'objetivos=%s archivo=%s\\n' "$(wc -l < "$salida")" "$salida"`,
    },
    {
      id: 'red-nmap',
      title: 'Red team: wrapper de descubrimiento con timeout',
      role: 'red',
      summary:
        'Un wrapper que registra inicio, valida el objetivo y limita el tiempo. No automatiza explotación; prepara evidencia ordenada.',
      tags: ['reconocimiento', 'timeout', 'logging'],
      code: `#!/usr/bin/env bash
set -euo pipefail

objetivo="\${1:?uso: $0 <host-o-cidr>}"
mkdir -p evidencias
marca="$(date -u +%Y%m%dT%H%M%SZ)"
log="evidencias/nmap-$marca.log"

{
  printf '# objetivo=%s\\n' "$objetivo"
  printf '# inicio=%s\\n' "$marca"
  timeout 300 nmap -Pn -sV --top-ports 100 "$objetivo"
} 2>&1 | tee "$log"

printf 'evidencia=%s\\n' "$log"`,
    },
    {
      id: 'blue-auth',
      title: 'Blue team: resumen de fallos de autenticación',
      role: 'blue',
      summary:
        'Agrupa intentos fallidos por IP y usuario, con umbral configurable, para priorizar revisión sin volcar logs completos.',
      tags: ['auth', 'detección', 'sshd'],
      code: `#!/usr/bin/env bash
set -euo pipefail

umbral="\${1:-10}"
journalctl -u ssh --since '24 hours ago' --no-pager -o cat |
  awk '/Failed password/ {
    for (i=1; i<=NF; i++) {
      if ($i == "from") ip=$(i+1)
      if ($i == "for") user=$(i+2)
    }
    if (ip != "" && user != "") print ip, user
  }' |
  sort | uniq -c | sort -rn |
  awk -v u="$umbral" '$1 >= u { printf "%-6d %-15s %s\\n", $1, $2, $3 }'`,
    },
    {
      id: 'blue-integrity',
      title: 'Blue team: huella de integridad de una ruta',
      role: 'blue',
      summary:
        'Genera un manifiesto SHA-256 estable y lo compara con la línea base. Útil para detectar cambios entre dos momentos.',
      tags: ['integridad', 'sha256', 'dfir'],
      code: `#!/usr/bin/env bash
set -euo pipefail

ruta="\${1:?uso: $0 <ruta>}"
base="\${2:-baseline.sha256}"

find "$ruta" -type f -print0 |
  sort -z |
  xargs -0 sha256sum > "$base.nuevo"

if [[ -f "$base" ]]; then
  diff -u "$base" "$base.nuevo" || true
else
  mv "$base.nuevo" "$base"
  printf 'línea base creada: %s\\n' "$base"
fi`,
    },
    {
      id: 'admin-backup',
      title: 'Sysadmin: backup con lock, compresión y verificación',
      role: 'admin',
      summary:
        'Un backup no existe hasta que se puede restaurar. Este script bloquea ejecuciones concurrentes y comprueba el archivo generado.',
      tags: ['backup', 'tar', 'flock'],
      code: `#!/usr/bin/env bash
set -euo pipefail

origen="\${1:?uso: $0 <directorio>}"
destino="\${2:-/var/backups}"
fecha="$(date +%F_%H%M)"
archivo="$destino/backup-$fecha.tar.gz"

mkdir -p "$destino"
exec 9>/run/lock/backup.lock
flock -n 9 || { printf 'backup ya en curso\\n' >&2; exit 75; }

tar -C "$origen" -czf "$archivo" .
gzip -t "$archivo"
sha256sum "$archivo" > "$archivo.sha256"
printf 'backup=%s\\n' "$archivo"`,
    },
    {
      id: 'admin-service',
      title: 'Sysadmin: espera activa de servicio',
      role: 'admin',
      summary:
        'Comprueba sistema, unidad y endpoint antes de declarar un despliegue terminado. Falla con diagnóstico, no con un simple “error”.',
      tags: ['systemd', 'deploy', 'healthcheck'],
      code: `#!/usr/bin/env bash
set -euo pipefail

unidad="\${1:-app}"
url="\${2:-http://127.0.0.1:8080/health}"

for intento in {1..15}; do
  if systemctl is-active --quiet "$unidad" &&
     curl -fsS --max-time 3 "$url" >/dev/null; then
    printf 'servicio listo en el intento %d\\n' "$intento"
    exit 0
  fi
  sleep 2
done

systemctl status "$unidad" --no-pager >&2 || true
journalctl -u "$unidad" -n 30 --no-pager >&2 || true
exit 1`,
    },
    {
      id: 'network-mtu',
      title: 'Redes: comprobar MTU y pérdida',
      role: 'network',
      summary:
        'Prueba DF con tamaños decrecientes para estimar la MTU real de un camino y muestra el primer tamaño que pasa.',
      tags: ['mtu', 'icmp', 'diagnóstico'],
      code: `#!/usr/bin/env bash
set -euo pipefail

host="\${1:?uso: $0 <host>}"
for tamano in 1472 1400 1300 1200 1000; do
  if ping -M do -s "$tamano" -c 2 -W 2 "$host" >/dev/null 2>&1; then
    printf 'MTU de payload=%s (MTU≈%s)\\n' "$tamano" "$((tamano + 28))"
    exit 0
  fi
done

printf 'sin respuesta con DF hasta 1000 bytes\\n' >&2
exit 1`,
    },
    {
      id: 'network-ports',
      title: 'Redes: inventario de puertos con timeout',
      role: 'network',
      summary:
        'Prueba una lista de puertos contra varios hosts con timeout corto y salida tabulada, sin escanear rangos completos.',
      tags: ['tcp', 'puertos', 'inventario'],
      code: `#!/usr/bin/env bash
set -euo pipefail

hosts=("\${@:?uso: $0 <host> [host...]}")
puertos=(22 80 443 3306 5432 6379)

for host in "\${hosts[@]}"; do
  for puerto in "\${puertos[@]}"; do
    if timeout 1 bash -c "echo >/dev/tcp/$host/$puerto" 2>/dev/null; then
      printf '%-20s %-6s open\\n' "$host" "$puerto"
    fi
  done
done`,
    },
  ],
  references: [
    { label: 'GNU Bash Reference Manual', url: 'https://www.gnu.org/software/bash/manual/bash.html' },
    { label: 'Bash Guide (wooledge)', url: 'https://mywiki.wooledge.org/BashGuide' },
    { label: 'ShellCheck', url: 'https://www.shellcheck.net/' },
    { label: 'Google Shell Style Guide', url: 'https://google.github.io/styleguide/shellguide.html' },
  ],
};
