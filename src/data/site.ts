export const NAV_LINKS = [
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'constructor', label: 'Constructor' },
  { id: 'tacticas', label: 'Tácticas' },
  { id: 'rutas', label: 'Rutas' },
  { id: 'chuleta', label: 'Chuleta' },
  { id: 'glosario', label: 'Glosario' },
];

export interface PathStep {
  commandId: string;
  title: string;
  why: string;
}

export interface LearningPath {
  id: string;
  title: string;
  role: string;
  accent: string;
  description: string;
  steps: PathStep[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'red',
    title: 'Red team',
    role: 'De cero a un engagement',
    accent: 'coral',
    description:
      'Del reconocimiento pasivo al movimiento lateral. Una ruta progresiva para entender qué se prueba, en qué orden y por qué cada paso importa.',
    steps: [
      {
        commandId: 'dig',
        title: 'Leer el DNS sin tocar el objetivo',
        why: 'Empieza por lo público: registros, correo y delegaciones. Un AXFR o un TXT olvidado cambian el alcance.',
      },
      {
        commandId: 'nmap',
        title: 'Mapear puertos y servicios',
        why: 'Convierte nombres en superficie real. Aprende a distinguir filtered, closed y open, y cuándo usar -Pn.',
      },
      {
        commandId: 'ffuf',
        title: 'Descubrir rutas y parámetros',
        why: 'El servidor web casi nunca enseña todo. Aprende a filtrar soft-404 y a encontrar parámetros ocultos.',
      },
      {
        commandId: 'sqlmap',
        title: 'Confirmar una inyección con evidencia',
        why: 'Detección, enumeración y volcado selectivo. El objetivo es demostrar impacto, no reventar la base de datos.',
      },
      {
        commandId: 'hydra',
        title: 'Auditar la fortaleza de credenciales',
        why: 'Antes de lanzar un diccionario, entiende la política de bloqueo y limita la concurrencia.',
      },
      {
        commandId: 'msfconsole',
        title: 'Explotar y gestionar sesiones',
        why: 'Aprende a leer el rank de un módulo, configurar opciones y documentar cada sesión.',
      },
      {
        commandId: 'chisel',
        title: 'Pivotar hacia la red interna',
        why: 'Cuando el host comprometido ve más red que tú, necesitas un túnel reproducible y cerrado al terminar.',
      },
    ],
  },
  {
    id: 'blue',
    title: 'Blue team',
    role: 'Detectar, contener, demostrar',
    accent: 'blue',
    description:
      'La otra mitad del trabajo: visibilidad, evidencia y respuesta. Esta ruta va de los logs al análisis de memoria y disco.',
    steps: [
      {
        commandId: 'tcpdump',
        title: 'Capturar el tráfico correcto',
        why: 'Antes de investigar, aprende a filtrar en captura y a preservar un pcap con integridad.',
      },
      {
        commandId: 'zeek',
        title: 'Convertir tráfico en logs consultables',
        why: 'conn.log, dns.log y http.log dan contexto que un pcap crudo no ofrece a simple vista.',
      },
      {
        commandId: 'ausearch',
        title: 'Reconstruir actividad en Linux',
        why: 'Execuciones, accesos y cambios de archivos. Sin reglas de auditd, esta evidencia no existe.',
      },
      {
        commandId: 'volatility3',
        title: 'Analizar memoria sin arrancar el sistema',
        why: 'Procesos ocultos, conexiones y malware fileless solo aparecen aquí. Aprende a comparar pslist y psscan.',
      },
      {
        commandId: 'yara',
        title: 'Clasificar artefactos con reglas',
        why: 'Una regla bien escrita convierte una muestra en una detección reutilizable en toda la flota.',
      },
      {
        commandId: 'df',
        title: 'Detectar el impacto en el host',
        why: 'Un disco lleno o inodos agotados pueden ser el primer síntoma de un incidente, no solo un problema de capacidad.',
      },
      {
        commandId: 'aide',
        title: 'Demostrar qué cambió',
        why: 'La integridad de archivos aporta la línea temporal que falta en muchos informes.',
      },
    ],
  },
  {
    id: 'sysadmin',
    title: 'Sysadmin',
    role: 'El sistema bajo control',
    accent: 'mint',
    description:
      'Una ruta de operación diaria: servicios, logs, procesos, disco y red. Menos fuegos y más criterio cuando algo falla.',
    steps: [
      {
        commandId: 'systemctl',
        title: 'Entender el estado de un servicio',
        why: 'status y journalctl cuentan historias distintas. Aprende a leer ambas antes de reiniciar.',
      },
      {
        commandId: 'journalctl',
        title: 'Filtrar logs con precisión',
        why: 'Por unidad, prioridad y ventana temporal. El ruido es el enemigo del diagnóstico.',
      },
      {
        commandId: 'ps',
        title: 'Ver procesos y jerarquías',
        why: 'Un proceso hijo inesperado explica más que un consumo alto de CPU.',
      },
      {
        commandId: 'lsof',
        title: 'Saber quién tiene abierto qué',
        why: 'Puertos, archivos borrados y montajes bloqueados. lsof responde preguntas que ss no puede.',
      },
      {
        commandId: 'df',
        title: 'Diagnosticar disco e inodos',
        why: 'El espacio libre no lo es todo: un sistema sin inodos falla igual que un disco lleno.',
      },
      {
        commandId: 'rsync',
        title: 'Hacer backups que se puedan restaurar',
        why: 'Simula con --dry-run, protege con --delete y verifica siempre la restauración.',
      },
      {
        commandId: 'ufw',
        title: 'Exponer solo lo necesario',
        why: 'Un firewall base bien entendido evita el 90 % de las exposiciones accidentales.',
      },
    ],
  },
  {
    id: 'network',
    title: 'Redes',
    role: 'Del cable al servicio',
    accent: 'sky',
    description:
      'Diagnóstico de red con criterio: direcciones, conexiones, capturas, rutas y rendimiento real entre dos puntos.',
    steps: [
      {
        commandId: 'ip',
        title: 'Leer interfaces y rutas',
        why: 'Antes de capturar, confirma qué interfaz tiene la IP y por dónde sale el tráfico.',
      },
      {
        commandId: 'ss',
        title: 'Ver sockets y procesos',
        why: 'Distingue un servicio caído de un puerto ocupado por el proceso equivocado.',
      },
      {
        commandId: 'ss',
        title: 'Diagnosticar estados TCP',
        why: 'Retransmisiones, close-wait y RTT explican lentitud mejor que "la red va mal".',
      },
      {
        commandId: 'tcpdump',
        title: 'Capturar sin ahogarte',
        why: 'Filtros BPF, -s0 y pcap: la diferencia entre evidencia y ruido.',
      },
      {
        commandId: 'mtr',
        title: 'Localizar la pérdida de paquetes',
        why: 'La pérdida por salto mal interpretada genera informes falsos. Aprende a leer el último salto.',
      },
      {
        commandId: 'iperf3',
        title: 'Medir ancho de banda real',
        why: 'Una descarga lenta no es una prueba de red. Mide throughput, jitter y pérdida con método.',
      },
      {
        commandId: 'snmpwalk',
        title: 'Inventariar dispositivos',
        why: 'Routers y switches cuentan su versión, interfaces y vecinos por SNMP. Protégelo con v3.',
      },
    ],
  },
  {
    id: 'web',
    title: 'Hacking web',
    role: 'De la superficie a la evidencia',
    accent: 'violet',
    description:
      'Una ruta para no disparar herramientas al azar: identificar la tecnología, descubrir rutas y parámetros, confirmar la vulnerabilidad y documentar el impacto con evidencia.',
    steps: [
      {
        commandId: 'whatweb',
        title: 'Reconocer la tecnología',
        why: 'Antes de probar nada, identifica servidor, CMS, framework y versiones. La tecnología condiciona qué pruebas tienen sentido.',
      },
      {
        commandId: 'ffuf',
        title: 'Descubrir rutas y archivos',
        why: 'El mapa visible casi nunca es todo. Aprende a calibrar el 404 y a filtrar por tamaño para no perderte en el ruido.',
      },
      {
        commandId: 'arjun',
        title: 'Encontrar parámetros ocultos',
        why: 'Una ruta sin parámetros visibles puede aceptar entradas por GET, POST o JSON. Los parámetros olvidados son superficie real.',
      },
      {
        commandId: 'sqlmap',
        title: 'Confirmar una inyección SQL',
        why: 'Detecta, enumera y demuestra impacto sin volcar datos innecesarios. La evidencia mínima es más profesional y más segura.',
      },
      {
        commandId: 'xsstrike',
        title: 'Analizar XSS por contexto',
        why: 'No todos los reflejos ejecutan JavaScript. Aprende a distinguir HTML, atributo y contexto DOM antes de reportar.',
      },
      {
        commandId: 'ssrfmap',
        title: 'Medir el alcance de un SSRF',
        why: 'Un SSRF puede leer archivos, alcanzar metadatos cloud o escanear la red interna. Documenta el impacto exacto, no solo el eco.',
      },
      {
        commandId: 'nuclei',
        title: 'Cerrar con comprobaciones reproducibles',
        why: 'Las plantillas convierten hallazgos en pruebas repetibles. Revisa falsos positivos y guarda la versión de las plantillas usadas.',
      },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud y contenedores',
    role: 'Construir, escanear, firmar',
    accent: 'indigo',
    description:
      'La cadena de suministro moderna: empaquetar, inventariar dependencias, escanear vulnerabilidades, firmar artefactos y desplegar con controles verificables.',
    steps: [
      {
        commandId: 'docker',
        title: 'Entender la imagen que despliegas',
        why: 'Una imagen no es una caja negra: revisa capas, usuario, variables y puertos antes de publicarla.',
      },
      {
        commandId: 'trivy',
        title: 'Escanear vulnerabilidades',
        why: 'Detecta paquetes y configuraciones de riesgo en la imagen. Un escaneo sin política de bloqueo es solo un informe.',
      },
      {
        commandId: 'syft',
        title: 'Generar el SBOM',
        why: 'Sin inventario de dependencias no puedes responder qué te afecta. Genera el SBOM en la misma build que la imagen.',
      },
      {
        commandId: 'cosign',
        title: 'Firmar y verificar artefactos',
        why: 'Una firma válida demuestra quién publicó la imagen. La verificación debe ser obligatoria antes de desplegar.',
      },
      {
        commandId: 'kubectl',
        title: 'Revisar el manifiesto en seco',
        why: 'Usa dry-run y diff para detectar cambios antes de tocar el cluster. El contexto y el namespace importan tanto como el YAML.',
      },
      {
        commandId: 'helm',
        title: 'Desplegar de forma reproducible',
        why: 'Fija versiones, renderiza templates y usa rollback. Un chart sin versión fija no es reproducible.',
      },
      {
        commandId: 'kube-bench',
        title: 'Auditar el cluster',
        why: 'Comprueba los controles CIS del plano de control y de los nodos. Prioriza los fallos explotables en tu modelo de amenaza.',
      },
    ],
  },
];

export interface CheatItem {
  label: string;
  code: string;
  desc: string;
}

export interface CheatSheet {
  id: string;
  label: string;
  title: string;
  description: string;
  items: CheatItem[];
}

export const CHEATSHEETS: CheatSheet[] = [
  {
    id: 'shell',
    label: 'Shell',
    title: 'La sintaxis que multiplica todo',
    description:
      'Redirecciones, tuberías, sustitución y control de trabajos. Estos operadores aparecen en casi todos los comandos del arsenal.',
    items: [
      { label: 'Tubería', code: 'comando1 | comando2', desc: 'Envía la salida del primero a la entrada del segundo.' },
      { label: 'Redirigir salida', code: 'comando > archivo.txt', desc: 'Sobrescribe el archivo con stdout.' },
      { label: 'Añadir salida', code: 'comando >> archivo.txt', desc: 'Añade stdout al final sin borrar el contenido.' },
      { label: 'Errores a archivo', code: 'comando 2> errores.log', desc: 'Redirige solo stderr.' },
      { label: 'Salida y errores', code: 'comando > todo.log 2>&1', desc: 'Une stdout y stderr en el mismo destino.' },
      { label: 'Sustitución', code: 'kill -HUP $(cat /run/app.pid)', desc: 'Ejecuta un comando y usa su salida como argumento.' },
      { label: 'Y lógico', code: 'apt update && apt upgrade', desc: 'El segundo solo se ejecuta si el primero devuelve 0.' },
      { label: 'O lógico', code: 'ping -c1 host || echo caido', desc: 'El segundo se ejecuta solo si el primero falla.' },
      { label: 'Segundo plano', code: 'comando &', desc: 'Lanza el proceso en background y devuelve el prompt.' },
      { label: 'Here-doc', code: "cat <<'EOF' > script.sh", desc: 'Escribe varias líneas sin escapar variables.' },
    ],
  },
  {
    id: 'text',
    label: 'Texto',
    title: 'grep, awk, sed y jq',
    description:
      'Convierte logs y JSON en respuestas. La combinación de estas cuatro herramientas resuelve la mayoría del análisis ad hoc.',
    items: [
      { label: 'Buscar recursivo', code: 'grep -Rni "error" /var/log --include="*.log"', desc: 'Recursivo, con número de línea y sin distinguir mayúsculas.' },
      { label: 'Invertir coincidencia', code: 'grep -v "healthcheck" app.log', desc: 'Muestra todo lo que no coincide con el patrón.' },
      { label: 'Solo la coincidencia', code: 'grep -oE "[0-9.]+" access.log', desc: 'Extrae únicamente el fragmento que coincide.' },
      { label: 'Columna con awk', code: "awk '{print $1, $9}' access.log", desc: 'Imprime la primera y novena columna.' },
      { label: 'Sumar con awk', code: "awk '{s+=$10} END {print s}' access.log", desc: 'Acumula un campo y lo muestra al final.' },
      { label: 'Sustituir con sed', code: "sed -i.bak 's/old/new/g' config.conf", desc: 'Reemplaza y guarda copia .bak antes de modificar.' },
      { label: 'Filtrar JSON', code: "jq -r '.[] | select(.ok) | .name' data.json", desc: 'Itera, filtra y extrae un campo sin comillas.' },
      { label: 'Top de IPs', code: "awk '{print $1}' access.log | sort | uniq -c | sort -rn | head", desc: 'Cuenta y ordena las IPs más frecuentes.' },
      { label: 'CSV desde JSON', code: "jq -r '.[] | [.id, .name] | @csv' data.json", desc: 'Convierte un array JSON en CSV correctamente escapado.' },
    ],
  },
  {
    id: 'permissions',
    label: 'Permisos',
    title: 'chmod, chown y umask',
    description:
      'Los permisos son la primera línea de defensa y la causa más común de servicios caídos. Memoriza los modos que importan.',
    items: [
      { label: 'Archivo público', code: 'chmod 644 archivo', desc: 'Propietario lee/escribe; grupo y otros leen.' },
      { label: 'Directorio público', code: 'chmod 755 directorio', desc: 'Propietario escribe; todos leen y atraviesan.' },
      { label: 'Datos privados', code: 'chmod 600 secreto.env', desc: 'Solo el propietario puede leer y escribir.' },
      { label: 'Grupo colaborativo', code: 'chmod 640 informe.txt', desc: 'El grupo lee; otros no ven nada.' },
      { label: 'Cambiar dueño', code: 'chown www-data:www-data archivo', desc: 'Asigna usuario y grupo propietarios.' },
      { label: 'Setuid', code: 'chmod u+s binario', desc: 'El binario se ejecuta con los privilegios del propietario.' },
      { label: 'Sticky bit', code: 'chmod +t /compartido', desc: 'Solo el dueño puede borrar sus archivos en el directorio.' },
      { label: 'Máscara por defecto', code: 'umask 027', desc: 'Archivos nuevos: 640; directorios: 750.' },
      { label: 'Encontrar SUID', code: 'find / -xdev -perm -4000 -type f -ls 2>/dev/null', desc: 'Audita los binarios setuid del sistema.' },
    ],
  },
  {
    id: 'systemd',
    label: 'systemd',
    title: 'Servicios y logs sin perderse',
    description:
      'La pareja systemctl + journalctl resuelve la mayoría de incidencias en Linux moderno. Estos son los atajos que usarás a diario.',
    items: [
      { label: 'Estado completo', code: 'systemctl status nginx --no-pager', desc: 'Estado, PID, último error y arranque.' },
      { label: 'Errores del servicio', code: 'journalctl -u nginx -p err -n 100', desc: 'Solo errores y las últimas cien líneas.' },
      { label: 'Seguir logs', code: 'journalctl -fu nginx', desc: 'Sigue la unidad en tiempo real.' },
      { label: 'Habilitar al arranque', code: 'systemctl enable --now servicio', desc: 'Activa el arranque automático y lo inicia ya.' },
      { label: 'Recargar definiciones', code: 'systemctl daemon-reload', desc: 'Obligatorio tras editar un archivo .service.' },
      { label: 'Unidades fallidas', code: 'systemctl list-units --failed', desc: 'Todo lo que no arrancó correctamente.' },
      { label: 'Logs de un arranque', code: 'journalctl -b -1 -p warning', desc: 'Advertencias del arranque anterior.' },
      { label: 'Espacio del journal', code: 'journalctl --disk-usage', desc: 'Cuánto ocupan los logs de systemd.' },
      { label: 'Override limpio', code: 'systemctl edit servicio', desc: 'Crea un drop-in sin tocar el paquete original.' },
    ],
  },
  {
    id: 'network',
    label: 'Red',
    title: 'Diagnóstico en cinco comandos',
    description:
      'La secuencia que va de "no funciona" a una causa concreta: direcciones, sockets, ruta, captura y rendimiento.',
    items: [
      { label: 'Interfaces y rutas', code: 'ip -br addr && ip route', desc: 'Direcciones, estado y puerta de enlace.' },
      { label: 'Puertos en escucha', code: 'sudo ss -tulpn', desc: 'Qué servicio ocupa cada puerto y con qué proceso.' },
      { label: 'Conexiones establecidas', code: 'ss -tnp state established', desc: 'Conexiones activas con su proceso.' },
      { label: 'Captura dirigida', code: 'sudo tcpdump -i any -nn -s0 port 443 -w https.pcap', desc: 'Captura completa de un puerto a pcap.' },
      { label: 'Ruta con latencia', code: 'mtr -rwc 20 1.1.1.1', desc: 'Informe de pérdida y latencia por salto.' },
      { label: 'Comprobar puerto', code: 'nc -zv host 22 80 443', desc: 'Prueba TCP sin enviar datos de aplicación.' },
      { label: 'Ancho de banda', code: 'iperf3 -c host -t 30 -P 4', desc: 'Mide throughput con cuatro flujos.' },
      { label: 'DNS limpio', code: 'dig +short example.com A', desc: 'Respuesta DNS mínima para scripts.' },
      { label: 'HTTP con tiempos', code: 'curl -sS -o /dev/null -w "%{http_code} %{time_total}s\\n" https://host', desc: 'Código de estado y tiempo total.' },
    ],
  },
  {
    id: 'web',
    label: 'Web',
    title: 'Del fingerprint a la evidencia',
    description:
      'La secuencia corta para revisar una aplicación: tecnología, rutas, parámetros, inyecciones y validación final. Ajusta siempre el alcance.',
    items: [
      { label: 'Fingerprint', code: 'whatweb -a 3 https://example.com', desc: 'Servidor, CMS, frameworks y versiones declaradas.' },
      { label: 'Rutas', code: 'ffuf -w wordlist.txt -u https://example.com/FUZZ -mc 200,204,301,302,401,403', desc: 'Descubre rutas y conserva también las protegidas.' },
      { label: 'Parámetros', code: 'arjun -u https://example.com/api -m GET', desc: 'Busca parámetros aceptados que no aparecen en la URL.' },
      { label: 'SQLi', code: 'sqlmap -u "https://example.com/item?id=1" --batch --dbs', desc: 'Confirma inyección y enumera bases de datos.' },
      { label: 'XSS', code: 'xsstrike -u "https://example.com/search?q=test" --skip', desc: 'Analiza el contexto del reflejo antes de confirmar.' },
      { label: 'SSRF', code: 'ssrfmap -r request.txt -p url -m readfiles', desc: 'Prueba lectura de archivos desde un parámetro vulnerable.' },
      { label: 'Plantillas', code: 'nuclei -u https://example.com -severity critical,high', desc: 'Comprobaciones reproducibles de alta severidad.' },
      { label: 'JWT', code: "cut -d. -f2 token.jwt | tr '_-' '/+' | base64 -d 2>/dev/null | jq .", desc: 'Inspecciona el payload de un token sin verificarlo.' },
      { label: 'Cabeceras', code: 'curl -sI https://example.com', desc: 'Revisa servidor, cookies, CORS y políticas de seguridad.' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    title: 'Supply chain en nueve líneas',
    description:
      'El mínimo control para una imagen y un cluster: inventario, escaneo, firma, validación de manifiestos y auditoría CIS.',
    items: [
      { label: 'SBOM', code: 'syft image:app:1.4.2 -o cyclonedx-json --file sbom.json', desc: 'Inventario de componentes en formato CycloneDX.' },
      { label: 'Vulnerabilidades', code: 'trivy image --severity HIGH,CRITICAL app:1.4.2', desc: 'Filtra solo los hallazgos de mayor impacto.' },
      { label: 'Firmar', code: 'cosign sign --key cosign.key registry.example.com/app:1.4.2', desc: 'Firma la imagen con la clave del proyecto.' },
      { label: 'Verificar', code: 'cosign verify --key cosign.pub registry.example.com/app:1.4.2', desc: 'Falla si la imagen no tiene una firma válida.' },
      { label: 'Manifiesto', code: 'kubectl apply --dry-run=server -f deploy.yaml', desc: 'Valida contra la API sin crear recursos.' },
      { label: 'Render Helm', code: 'helm template app ./chart -f values-prod.yaml', desc: 'Revisa el YAML final antes de instalar.' },
      { label: 'CIS', code: 'kube-bench run --targets master,node', desc: 'Audita el plano de control y los nodos.' },
      { label: 'Secretos', code: 'gitleaks detect --source . --no-banner', desc: 'Busca credenciales en el historial del repositorio.' },
      { label: 'Rootless', code: 'podman run --rm -it alpine sh', desc: 'Prueba un contenedor sin daemon ni root.' },
    ],
  },
];

export const GLOSSARY = [
  {
    term: 'Red team',
    definition:
      'Equipo que simula un atacante real para evaluar la capacidad de detección y respuesta de una organización. Trabaja con reglas de engagement y un alcance autorizado.',
  },
  {
    term: 'Blue team',
    definition:
      'Equipo defensivo: monitoriza, detecta, responde y recupera. Su éxito se mide en visibilidad, tiempo de detección y contención, no en "no recibir ataques".',
  },
  {
    term: 'Purple team',
    definition:
      'Colaboración entre red y blue para convertir hallazgos ofensivos en detecciones y controles verificables. No es un equipo separado, sino una forma de trabajar.',
  },
  {
    term: 'CVE',
    definition:
      'Identificador público de una vulnerabilidad concreta en un producto. Un CVE no implica que tu instalación sea explotable: depende de versión, configuración y exposición.',
  },
  {
    term: 'CVSS',
    definition:
      'Puntuación de severidad de una vulnerabilidad (0-10). Es una referencia, no una medida del riesgo real de tu entorno. El contexto manda.',
  },
  {
    term: 'MITRE ATT&CK',
    definition:
      'Base de conocimiento de tácticas y técnicas observadas en ataques reales. Sirve para mapear detecciones y entender qué fase del ataque cubre cada control.',
  },
  {
    term: 'TTP',
    definition:
      'Tácticas, técnicas y procedimientos: el "cómo" de un adversario. Son más estables que los IOCs y más útiles para detección a largo plazo.',
  },
  {
    term: 'IOC',
    definition:
      'Indicador de compromiso: hash, dominio, IP, ruta o firma. Es evidencia observable, pero caduca rápido y puede generar falsos positivos.',
  },
  {
    term: 'Pentest',
    definition:
      'Prueba de seguridad autorizada, con alcance, metodología y fechas definidas. Sin contrato y autorización escrita no es un pentest: es un delito.',
  },
  {
    term: 'Pivoting',
    definition:
      'Usar un host comprometido como puente para alcanzar redes internas que no son accesibles directamente. Requiere túneles y limpieza posterior.',
  },
  {
    term: 'Movimiento lateral',
    definition:
      'Desplazamiento controlado de un sistema a otro dentro de una red comprometida. En Windows suele apoyarse en SMB, WinRM, RDP o Kerberos.',
  },
  {
    term: 'Hash',
    definition:
      'Huella digital unidireccional de unos datos. No es cifrado: no se "descifra", se intenta romper por diccionario o fuerza bruta. Una sal dificulta ese ataque.',
  },
  {
    term: 'Hash salado',
    definition:
      'Hash al que se añade un valor único por contraseña antes de calcularlo. Evita que dos usuarios con la misma contraseña compartan hash y frena las rainbow tables.',
  },
  {
    term: 'DFIR',
    definition:
      'Digital Forensics and Incident Response: adquisición, preservación y análisis de evidencia, más la gestión de la respuesta al incidente.',
  },
  {
    term: 'WAF',
    definition:
      'Web Application Firewall. Inspecciona tráfico HTTP y bloquea patrones conocidos. Es una capa de defensa, no una excusa para no corregir el código.',
  },
  {
    term: 'SOC',
    definition:
      'Security Operations Center: equipo y procesos que monitorizan alertas, investigan y responden. Su calidad depende de la telemetría y del contexto, no solo de las herramientas.',
  },
  {
    term: 'SSRF',
    definition:
      'Server-Side Request Forgery: la aplicación realiza una petición a una URL controlada por el atacante. Puede alcanzar servicios internos, metadatos cloud o archivos locales.',
  },
  {
    term: 'AD CS',
    definition:
      'Active Directory Certificate Services: infraestructura de certificados de Windows. Una plantilla mal configurada puede permitir suplantar cuentas y persistir aunque se cambie la contraseña.',
  },
  {
    term: 'SBOM',
    definition:
      'Software Bill of Materials: inventario de componentes y dependencias de un artefacto. Permite saber qué vulnerabilidades afectan realmente a lo que despliegas.',
  },
  {
    term: 'EDR',
    definition:
      'Endpoint Detection and Response: telemetría y respuesta en el endpoint. Detecta comportamiento, no solo firmas, y permite aislar un host comprometido.',
  },
  {
    term: 'Kerberoasting',
    definition:
      'Solicitud de tickets de servicio Kerberos para crackear offline la contraseña de la cuenta asociada. Se mitiga con contraseñas largas y cuentas de servicio gestionadas.',
  },
  {
    term: 'WPA3',
    definition:
      'Estándar Wi-Fi que sustituye el handshake WPA2-PSK por SAE y añade protección contra ataques de diccionario offline. Requiere compatibilidad de AP y clientes.',
  },
];

export const FAQS = [
  {
    question: '¿Puedo ejecutar cualquiera de estos comandos sin más?',
    answer:
      'No. Muchos comandos modifican sistemas, capturan tráfico o atacan servicios. Úsalos solo en equipos propios o con autorización escrita. La página es documentación: la responsabilidad de ejecutarla es de quien la usa.',
  },
  {
    question: '¿Los comandos funcionan en cualquier distribución Linux?',
    answer:
      'La mayoría son de Linux y muchas herramientas vienen en Kali o Parrot. Otras (ufw, apt, semanage) dependen de la distribución. Cada ficha indica la sintaxis y las alternativas; comprueba la versión instalada antes de copiar.',
  },
  {
    question: '¿Por qué no hay un botón para "ejecutar" los comandos?',
    answer:
      'Porque esta web es estática y se ejecuta en tu navegador. Lanzar comandos de sistema desde una página sería un riesgo enorme e imposible de controlar. El objetivo es que entiendas, adaptes y copies con criterio.',
  },
  {
    question: '¿Cómo se despliega en GitHub Pages?',
    answer:
      'El repositorio incluye un workflow de GitHub Actions que compila con Vite y publica dist en Pages. Solo tienes que activar Pages con origen "GitHub Actions" en la configuración del repositorio.',
  },
  {
    question: '¿Cada cuánto se actualiza la base de comandos?',
    answer:
      'La base es local y versionada en el repositorio. Puedes añadir comandos en src/data/commands y el buscador, los filtros y las estadísticas se recalculan solos. El script de validación comprueba que no haya IDs duplicados ni campos vacíos.',
  },
  {
    question: '¿Puedo usar la web sin conexión?',
    answer:
      'Sí, una vez cargada es una aplicación estática. No depende de APIs externas ni envía tus búsquedas a ningún servidor. Los favoritos y el progreso se guardan en localStorage.',
  },
  {
    question: '¿Cuál es la diferencia entre hydra y medusa?',
    answer:
      'Ambas hacen fuerza bruta de credenciales. hydra es más conocida y tiene módulos muy probados; medusa ofrece paralelismo distinto y una sintaxis de módulos propia. Aprende una y entiende sus límites: la política de bloqueo importa más que la herramienta.',
  },
  {
    question: '¿Qué hago si encuentro un comando incorrecto?',
    answer:
      'Verifica la versión y la documentación oficial, y corrige la ficha en el repositorio. En seguridad, una flag mal documentada puede causar un incidente; la revisión entre pares es parte del proyecto.',
  },
];

export const BUILDER_SECTION_COPY = {
  eyebrow: 'Laboratorio',
  title: 'Construye el comando. Copia con criterio.',
  description:
    'Selecciona una herramienta, activa solo las flags que necesitas y observa cómo se compone la línea final. Cada opción incluye su efecto real.',
};
