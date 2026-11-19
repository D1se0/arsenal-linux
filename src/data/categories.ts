import type { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'recon',
    label: 'Reconocimiento',
    short: 'OSINT y huella',
    description:
      'Cartografía el objetivo sin tocarlo: DNS, registros, subdominios, tecnologías expuestas y rastros públicos.',
    accent: 'lime',
    icon: 'radar',
  },
  {
    id: 'scanning',
    label: 'Escaneo y enumeración',
    short: 'Servicios y recursos',
    description:
      'Descubre puertos, rutas, comparticiones SMB, directorios LDAP y comunidades SNMP antes de explotar nada.',
    accent: 'cyan',
    icon: 'scan',
  },
  {
    id: 'web',
    label: 'Hacking web',
    short: 'Superficie HTTP',
    description:
      'Fuzzing, inyecciones, JWT, CORS, crawlers y explotación de las aplicaciones que viven en el puerto 80 y 443.',
    accent: 'violet',
    icon: 'globe',
  },
  {
    id: 'exploit',
    label: 'Explotación',
    short: 'Acceso y post-explotación',
    description:
      'Del fallo al shell: Metasploit, credenciales, SMB, Active Directory y movimiento lateral controlado.',
    accent: 'coral',
    icon: 'swords',
  },
  {
    id: 'passwords',
    label: 'Contraseñas y hashes',
    short: 'Credenciales',
    description:
      'Genera, captura y recupera credenciales. Wordlists, reglas, máscaras y ataques de diccionario bien medidos.',
    accent: 'amber',
    icon: 'key',
  },
  {
    id: 'network',
    label: 'Redes y tráfico',
    short: 'Paquetes y rutas',
    description:
      'Inspecciona interfaces, conexiones, rutas y paquetes. Diagnostica, captura y entiende qué pasa en el cable.',
    accent: 'sky',
    icon: 'network',
  },
  {
    id: 'sysadmin',
    label: 'Administración',
    short: 'Sistemas Linux',
    description:
      'Servicios, procesos, discos, permisos y paquetes. El día a día de quien mantiene un sistema vivo.',
    accent: 'mint',
    icon: 'server',
  },
  {
    id: 'shell',
    label: 'Shell y utilidades',
    short: 'Texto y automatización',
    description:
      'grep, awk, sed, find, tar, ssh. Los multiplicadores de fuerza que convierten una terminal en un taller.',
    accent: 'teal',
    icon: 'terminal',
  },
  {
    id: 'forensics',
    label: 'Blue Team y DFIR',
    short: 'Detección y respuesta',
    description:
      'Memoria, discos, logs, integridad y tráfico. Reconstruye qué ocurrió y demuéstralo con evidencias.',
    accent: 'blue',
    icon: 'shield',
  },
  {
    id: 'hardening',
    label: 'Hardening y cripto',
    short: 'Blindaje defensivo',
    description:
      'Firewall, fail2ban, SELinux, auditd, TLS y cifrado. Reduce la superficie antes de que alguien la encuentre.',
    accent: 'green',
    icon: 'lock',
  },
  {
    id: 'malware',
    label: 'Malware y reversing',
    short: 'Análisis estático',
    description:
      'Identifica, desempaqueta y analiza binarios sin ejecutarlos. Entiende el artefacto antes de detonarlo.',
    accent: 'pink',
    icon: 'bug',
  },
  {
    id: 'wireless',
    label: 'Wireless',
    short: '802.11',
    description:
      'Monitoriza el espectro, captura handshakes y audita redes Wi-Fi con las tarjetas y permisos adecuados.',
    accent: 'orange',
    icon: 'wifi',
  },
  {
    id: 'cloud',
    label: 'Cloud y contenedores',
    short: 'DevSecOps',
    description:
      'Docker, Kubernetes, IaC y secretos. Asegura la capa donde hoy viven los despliegues y los pipelines.',
    accent: 'indigo',
    icon: 'cloud',
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((category) => [category.id, category])) as Record<
  Category['id'],
  Category
>;
