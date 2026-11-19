export interface BuilderFlag {
  flag: string;
  label: string;
  note: string;
  value?: string;
  danger?: boolean;
}

export interface BuilderSpec {
  id: string;
  commandId: string;
  name: string;
  description: string;
  accent: string;
  base: string;
  targetLabel: string;
  target: string;
  defaults: string[];
  flags: BuilderFlag[];
}

export const BUILDER_SPECS: BuilderSpec[] = [
  {
    id: 'nmap',
    commandId: 'nmap',
    name: 'nmap',
    description: 'Escaneo TCP con detección de versiones y scripts por defecto.',
    accent: 'cyan',
    base: 'nmap',
    targetLabel: 'Objetivo',
    target: '10.10.10.5',
    defaults: ['-sS', '-sV', '-sC'],
    flags: [
      { flag: '-sS', label: 'SYN scan', note: 'Rápido y semiautomático; requiere root.' },
      { flag: '-sT', label: 'Connect scan', note: 'Sin root y más detectable, pero completa la conexión.' },
      { flag: '-sV', label: 'Versiones', note: 'Identifica el servicio y su versión.' },
      { flag: '-sC', label: 'Scripts default', note: 'Ejecuta comprobaciones NSE seguras y habituales.' },
      { flag: '-p-', label: 'Todos los puertos', note: 'Recorre los 65.535 puertos TCP.', danger: true },
      { flag: '-Pn', label: 'Sin ping', note: 'Asume que el host está vivo; útil si el ICMP está filtrado.' },
      { flag: '-A', label: 'Modo agresivo', note: 'Incluye OS, versiones, scripts y traceroute. Muy ruidoso.', danger: true },
      { flag: '--open', label: 'Solo abiertos', note: 'Oculta puertos cerrados y filtrados del resultado.' },
      { flag: '-T4', label: 'Timing 4', note: 'Acelera en redes fiables; más detectable.' },
      { flag: '--script', label: 'Scripts NSE', note: 'Carga scripts concretos o una categoría.', value: 'vuln' },
      { flag: '-oA', label: 'Guardar salida', note: 'Genera .nmap, .xml y .gnmap con el prefijo indicado.', value: 'scan' },
    ],
  },
  {
    id: 'ffuf',
    commandId: 'ffuf',
    name: 'ffuf',
    description: 'Fuzzing de rutas con autocalibración y filtro de falsos positivos.',
    accent: 'violet',
    base: 'ffuf -u',
    targetLabel: 'URL con FUZZ',
    target: 'https://example.com/FUZZ',
    defaults: ['-w', '-mc', '-ac'],
    flags: [
      { flag: '-w', label: 'Wordlist', note: 'Diccionario de nombres a probar.', value: '/usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt' },
      { flag: '-mc', label: 'Estados visibles', note: 'Solo muestra esos códigos HTTP.', value: '200,204,301,302,401,403' },
      { flag: '-fc', label: 'Estados ocultos', note: 'Descarta códigos que no aportan.', value: '404' },
      { flag: '-ac', label: 'Autocalibración', note: 'Aprende respuestas comodín y filtra ruido.' },
      { flag: '-t', label: 'Hilos', note: 'Concurrencia; 40 es un buen equilibrio.', value: '40' },
      { flag: '-recursion', label: 'Recursivo', note: 'Entra en los directorios encontrados.' },
      { flag: '-e', label: 'Extensiones', note: 'Añade sufijos a cada palabra.', value: '.php,.bak,.txt' },
      { flag: '-o', label: 'Guardar JSON', note: 'Salida estructurada para el informe.', value: 'rutas.json' },
      { flag: '-of', label: 'Formato', note: 'Formato de salida; combínalo con -o.', value: 'json' },
    ],
  },
  {
    id: 'tcpdump',
    commandId: 'tcpdump',
    name: 'tcpdump',
    description: 'Captura filtrada a pcap sin resolución inversa ni pérdida de bytes.',
    accent: 'sky',
    base: 'tcpdump -i eth0',
    targetLabel: 'Filtro BPF',
    target: 'port 443',
    defaults: ['-nn', '-s0'],
    flags: [
      { flag: '-nn', label: 'Sin resolver', note: 'Direcciones y puertos numéricos; más rápido.' },
      { flag: '-s0', label: 'Paquete completo', note: 'Captura todos los bytes, imprescindible para análisis.' },
      { flag: '-A', label: 'Payload ASCII', note: 'Muestra el contenido como texto.' },
      { flag: '-X', label: 'Hex + ASCII', note: 'Muestra el contenido en hexadecimal y ASCII.' },
      { flag: '-e', label: 'Cabeceras L2', note: 'Incluye direcciones MAC.' },
      { flag: '-c', label: 'Límite de paquetes', note: 'Detiene la captura tras n paquetes.', value: '100' },
      { flag: '-w', label: 'Guardar pcap', note: 'Escribe la captura a un fichero.', value: 'captura.pcap' },
      { flag: '-v', label: 'Verbose', note: 'Añade detalle del protocolo por paquete.' },
    ],
  },
  {
    id: 'find',
    commandId: 'find',
    name: 'find',
    description: 'Auditoría de archivos por permisos, tipo, fecha y tamaño.',
    accent: 'mint',
    base: 'find',
    targetLabel: 'Ruta de búsqueda',
    target: '/var/www',
    defaults: ['-type', '-xdev'],
    flags: [
      { flag: '-type', label: 'Tipo', note: 'f archivo, d directorio, l enlace simbólico.', value: 'f' },
      { flag: '-name', label: 'Nombre', note: 'Patrón de nombre, admite comodines.', value: '*.php' },
      { flag: '-iname', label: 'Nombre sin case', note: 'Como -name pero ignora mayúsculas.', value: '*.env' },
      { flag: '-perm -4000', label: 'SUID', note: 'Binarios que se ejecutan con privilegios del propietario.' },
      { flag: '-perm -0002', label: 'Writable por todos', note: 'Archivos que cualquier usuario puede modificar.' },
      { flag: '-mtime', label: 'Antigüedad (días)', note: 'Modificados hace más de n días.', value: '+30' },
      { flag: '-size', label: 'Tamaño', note: 'Mayores de n; admite M, G o k.', value: '+100M' },
      { flag: '-xdev', label: 'No cruzar montajes', note: 'Evita recorrer otros sistemas de archivos.' },
      { flag: '-ls', label: 'Listado detallado', note: 'Muestra metadatos tipo ls -l.' },
    ],
  },
  {
    id: 'journalctl',
    commandId: 'journalctl',
    name: 'journalctl',
    description: 'Investigación de logs por unidad, prioridad y ventana temporal.',
    accent: 'green',
    base: 'journalctl',
    targetLabel: 'Filtro principal',
    target: '-u nginx',
    defaults: ['-n', '--no-pager'],
    flags: [
      { flag: '-u', label: 'Unidad', note: 'Filtra por servicio, por ejemplo nginx.service.', value: 'nginx.service' },
      { flag: '-p', label: 'Prioridad', note: 'err, warning, info o nivel numérico.', value: 'err' },
      { flag: '-n', label: 'Últimas líneas', note: 'Limita la salida a n líneas.', value: '100' },
      { flag: '--since', label: 'Desde', note: 'Fecha o expresión como "1 hour ago".', value: '"1 hour ago"' },
      { flag: '--until', label: 'Hasta', note: 'Cierra la ventana temporal.', value: 'now' },
      { flag: '-f', label: 'Seguir en vivo', note: 'Equivalente a tail -f sobre el journal.' },
      { flag: '-b', label: 'Arranque actual', note: 'Limita al boot actual; -b -1 usa el anterior.' },
      { flag: '-k', label: 'Solo kernel', note: 'Mensajes del kernel, sin servicios.' },
      { flag: '-o', label: 'Salida', note: 'json, short, cat o verbose.', value: 'json' },
      { flag: '--no-pager', label: 'Sin paginación', note: 'Imprime todo sin abrir el paginador.' },
    ],
  },
  {
    id: 'ssh',
    commandId: 'ssh',
    name: 'ssh',
    description: 'Conexión y túneles con opciones explícitas.',
    accent: 'amber',
    base: 'ssh',
    targetLabel: 'Destino',
    target: 'usuario@10.10.10.5',
    defaults: ['-p'],
    flags: [
      { flag: '-p', label: 'Puerto', note: 'Puerto SSH del servidor.', value: '22' },
      { flag: '-i', label: 'Clave', note: 'Clave privada para autenticación.', value: '~/.ssh/id_ed25519' },
      { flag: '-L', label: 'Túnel local', note: 'Redirige un puerto local al host remoto.', value: '8080:127.0.0.1:80' },
      { flag: '-D', label: 'Proxy SOCKS', note: 'Crea un proxy SOCKS dinámico en local.', value: '1080' },
      { flag: '-J', label: 'ProxyJump', note: 'Salta por un host intermedio.', value: 'bastion.example.com' },
      { flag: '-N', label: 'Sin shell', note: 'Solo establece el túnel, no abre terminal.' },
      { flag: '-f', label: 'Background', note: 'Pasa a segundo plano antes de ejecutar.' },
      { flag: '-v', label: 'Debug', note: 'Salida detallada del handshake.' },
    ],
  },
  {
    id: 'docker',
    commandId: 'docker',
    name: 'docker run',
    description: 'Contenedor endurecido con mínimo privilegio.',
    accent: 'indigo',
    base: 'docker run --rm -it',
    targetLabel: 'Imagen',
    target: 'mi-imagen:1.0',
    defaults: ['--cap-drop=ALL', '--security-opt'],
    flags: [
      { flag: '--user', label: 'Usuario no root', note: 'Ejecuta con UID:GID sin privilegios.', value: '1000:1000' },
      { flag: '--cap-drop=ALL', label: 'Sin capabilities', note: 'Elimina todas las capacidades del kernel.' },
      { flag: '--security-opt', label: 'no-new-privileges', note: 'Impide ganar privilegios dentro del contenedor.', value: 'no-new-privileges' },
      { flag: '--read-only', label: 'Root readonly', note: 'Sistema de archivos de solo lectura; monta volúmenes para escribir.' },
      { flag: '-v', label: 'Volumen', note: 'Monta solo los datos necesarios.', value: 'datos:/data' },
      { flag: '-p', label: 'Puerto', note: 'Publica un puerto en el host.', value: '8080:80' },
      { flag: '--network', label: 'Red', note: 'Aísla el contenedor en una red concreta.', value: 'backend' },
      { flag: '--memory', label: 'Memoria', note: 'Limita el consumo de memoria.', value: '512m' },
    ],
  },
];
