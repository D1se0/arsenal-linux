import type { CommandExample } from '../types';

/**
 * Ejemplos adicionales para fichas ya existentes. Se concatenan en runtime,
 * de modo que la ampliación queda aislada del contenido histórico.
 */
export const EXTRA_EXAMPLES: Record<string, CommandExample[]> = {
  nmap: [
    {
      title: 'Inventario de scripts por categoría',
      kind: 'red',
      code: 'nmap -sV -p 21,22,80,443,445 --script "safe and discovery" 10.10.10.5',
      explain: 'Combina dos categorías NSE con un operador lógico. Es una forma controlada de obtener contexto sin lanzar pruebas intrusivas.',
    },
    {
      title: 'Comparar dos ventanas de exposición',
      kind: 'blue',
      code: 'nmap -sS -sV -p- -oX antes.xml 10.10.10.5\\nnmap -sS -sV -p- -oX despues.xml 10.10.10.5\\ndiff <(grep "port protocol" antes.xml) <(grep "port protocol" despues.xml)',
      explain: 'Guarda dos inventarios XML y compara los puertos detectados. Un servicio nuevo entre ambas fechas merece revisión inmediata.',
    },
  ],
  john: [
    {
      title: 'Forzar el formato correcto',
      kind: 'red',
      code: 'john --format=raw-sha256 --wordlist=rockyou.txt hashes.txt\\njohn --format=raw-sha256 --show hashes.txt',
      explain: 'Cuando John no detecta el formato, indicarlo evita falsos negativos. Después, --show consulta únicamente lo recuperado en el potfile.',
    },
    {
      title: 'Máscara para una política conocida',
      kind: 'blue',
      code: 'john --format=nt --mask="?u?l?l?l?l?d?d?s" ntlm.txt',
      explain: 'Modela una política de mayúscula, minúsculas, dígitos y símbolo. Sirve para medir si la política real resiste un ataque dirigido.',
    },
  ],
  hashcat: [
    {
      title: 'Combinar diccionario y reglas en un pipeline',
      kind: 'red',
      code: 'hashcat -m 1000 -a 0 ntlm.txt rockyou.txt -r best64.rule --potfile-path auditoria.pot\\nhashcat -m 1000 ntlm.txt --show --potfile-path auditoria.pot | sort -u > recuperadas.txt',
      explain: 'Usa un potfile separado para no mezclar auditorías y exporta las credenciales recuperadas. Trata el resultado como evidencia sensible.',
    },
    {
      title: 'Comprobar el modo antes de gastar GPU',
      kind: 'admin',
      code: 'hashid -m "$(head -1 hashes.txt)"\\nhashcat -m 1000 -b',
      explain: 'Identifica el formato y mide la velocidad del modo. Un modo equivocado puede tardar días sin producir ningún resultado.',
    },
  ],
  curl: [
    {
      title: 'Auditar cabeceras de seguridad',
      kind: 'blue',
      code: 'curl -sSIL https://ejemplo.com | grep -Ei "strict-transport-security|content-security-policy|x-frame-options|x-content-type-options|referrer-policy"',
      explain: 'Sigue redirecciones y filtra las cabeceras defensivas. La ausencia de HSTS o CSP es un hallazgo de configuración, no una vulnerabilidad explotable por sí sola.',
    },
    {
      title: 'Probar una API con token y JSON',
      kind: 'red',
      code: 'curl -sS -X POST https://api.ejemplo.com/v1/login -H "Content-Type: application/json" -d "{\\"user\\":\\"auditor\\",\\"pass\\":\\"demo\\"}" -w "\\nHTTP %{http_code}\\n"',
      explain: 'Envía credenciales de laboratorio y muestra el código final. Nunca pegues tokens reales en el historial; usa variables de entorno.',
    },
  ],
  ffuf: [
    {
      title: 'Descubrir virtual hosts',
      kind: 'red',
      code: 'ffuf -u http://10.10.10.5 -H "Host: FUZZ.ejemplo.com" -w subdominios.txt -fs 4242',
      explain: 'Fuzzea la cabecera Host contra una IP. El filtro por tamaño elimina la respuesta comodín del servidor web.',
    },
    {
      title: 'Recursión controlada',
      kind: 'red',
      code: 'ffuf -u https://ejemplo.com/FUZZ -w raft-medium-directories.txt -recursion -recursion-depth 2 -rate 40 -ac',
      explain: 'Entra en los directorios encontrados hasta dos niveles. La autocalibración y el rate bajo reducen falsos positivos y carga.',
    },
  ],
  sqlmap: [
    {
      title: 'Reutilizar una petición de Burp',
      kind: 'red',
      code: 'sqlmap -r request.txt -p id --batch --level=2 --risk=1 --dbs',
      explain: 'Carga una petición HTTP completa para conservar cookies, cabeceras y cuerpo. Revisa request.txt antes de guardarlo en el repositorio.',
    },
    {
      title: 'Evasión moderada de un WAF',
      kind: 'red',
      code: 'sqlmap -u "https://ejemplo.com/item?id=1" --tamper=space2comment,randomcase --level=3 --risk=1 --batch',
      explain: 'Aplica transformaciones para sortear filtros simples. La evasión no autorizada puede considerarse intrusiva; documenta el alcance.',
    },
  ],
  nuclei: [
    {
      title: 'Triage por severidad',
      kind: 'blue',
      code: 'nuclei -l activos.txt -severity critical,high -jsonl -o hallazgos.jsonl -rl 30',
      explain: 'Escanea el inventario y guarda JSON Lines. Revisa primero los críticos y confirma cada plantilla antes de abrir un incidente.',
    },
    {
      title: 'Solo exposiciones y paneles',
      kind: 'red',
      code: 'nuclei -u https://ejemplo.com -t exposures -t default-logins -severity high,critical',
      explain: 'Busca archivos y accesos por defecto sin lanzar todo el catálogo. Es una pasada rápida para priorizar superficies evidentes.',
    },
  ],
  hydra: [
    {
      title: 'Formulario HTTP con condición de fallo',
      kind: 'red',
      code: 'hydra -l admin -P pass.txt ejemplo.com http-post-form "/login:user=^USER^&pass=^PASS^:F=Invalid credentials" -t 4 -f',
      explain: 'Indica la ruta, el cuerpo y la cadena que aparece cuando el login falla. Si la condición es incorrecta, hydra reportará falsos positivos.',
    },
    {
      title: 'Validar bloqueo de cuenta',
      kind: 'blue',
      code: 'hydra -l test-audit -P intentos.txt 10.10.10.5 ssh -t 1 -f -V',
      explain: 'Prueba una cuenta de laboratorio con un solo hilo. Úsalo para comprobar que el bloqueo y las alertas funcionan, no para atacar usuarios reales.',
    },
  ],
  tcpdump: [
    {
      title: 'Rotar capturas por tamaño',
      kind: 'admin',
      code: 'sudo tcpdump -i eth0 -nn -s0 -w captura.pcap -C 100 -W 5 "port 443"',
      explain: 'Divide la captura en ficheros de 100 MB y conserva cinco. Evita llenar el disco durante una investigación larga.',
    },
    {
      title: 'Aislar tráfico de un host',
      kind: 'blue',
      code: 'sudo tcpdump -i any -nn -A "host 10.10.10.5 and port 80"',
      explain: 'Muestra el payload ASCII del host y puerto indicados. No captures tráfico de terceros sin autorización.',
    },
  ],
  systemctl: [
    {
      title: 'Revisar unidades fallidas',
      kind: 'admin',
      code: 'systemctl list-units --failed --no-pager\\nsystemctl status --no-pager <unidad>',
      explain: 'Localiza servicios que no arrancaron y muestra su último estado. Corrige la causa antes de reiniciar en bucle.',
    },
    {
      title: 'Comprobar exposición de un servicio',
      kind: 'blue',
      code: 'systemctl cat ssh.service\\nsystemd-analyze security ssh.service',
      explain: 'Revisa la unidad real y su puntuación de aislamiento. Los cambios de hardening deben probarse y poder revertirse.',
    },
  ],
  journalctl: [
    {
      title: 'Comparar el arranque actual con el anterior',
      kind: 'admin',
      code: 'journalctl -b -p err --no-pager\\njournalctl -b -1 -p err --no-pager',
      explain: 'Compara errores del boot actual y del anterior. Un fallo que solo aparece tras un cambio ayuda a correlacionar la causa.',
    },
    {
      title: 'Controlar el tamaño del journal',
      kind: 'blue',
      code: 'journalctl --disk-usage\\nsudo journalctl --vacuum-time=14d',
      explain: 'Mide y limita la retención. Antes de borrar, confirma que los logs se envían a un SIEM o que la retención legal está cubierta.',
    },
  ],
  docker: [
    {
      title: 'Auditar un contenedor en ejecución',
      kind: 'blue',
      code: 'docker inspect <id> --format "{{.HostConfig.Privileged}} {{.HostConfig.NetworkMode}} {{.Config.User}}"\\ndocker exec <id> id',
      explain: 'Comprueba privilegios, red y usuario efectivo. Un contenedor privilegiado o con root y montajes del host es un riesgo alto.',
    },
    {
      title: 'Limpiar sin tocar datos',
      kind: 'admin',
      code: 'docker system df\\ndocker image prune -f',
      explain: 'Muestra el consumo y elimina solo imágenes sin etiqueta. No uses prune -a sin revisar qué imágenes necesitas.',
    },
  ],
  kubectl: [
    {
      title: 'Decodificar un secret concreto',
      kind: 'red',
      code: 'kubectl get secret app-secret -o jsonpath="{.data.password}" | base64 -d; echo',
      explain: 'Extrae y decodifica un único campo. Los Secrets de Kubernetes son base64, no cifrado; trata el resultado como credencial.',
    },
    {
      title: 'Revisar permisos efectivos',
      kind: 'blue',
      code: 'kubectl auth can-i --list\\nkubectl auth can-i create pods --as=system:serviceaccount:default:app',
      explain: 'Comprueba qué puede hacer la identidad actual y una ServiceAccount concreta. Es una revisión RBAC rápida antes de aplicar cambios.',
    },
  ],
  tshark: [
    {
      title: 'Buscar posibles exfiltraciones DNS',
      kind: 'blue',
      code: 'tshark -r captura.pcap -Y "dns.flags.response == 0" -T fields -e dns.qry.name | sort | uniq -c | sort -nr | head -20',
      explain: 'Cuenta los nombres DNS más consultados. Nombres largos, aleatorios o con muchos subdominios pueden indicar túnel DNS.',
    },
    {
      title: 'Extraer peticiones HTTP',
      kind: 'blue',
      code: 'tshark -r captura.pcap -Y "http.request" -T fields -e ip.src -e http.host -e http.request.method -e http.request.uri',
      explain: 'Genera una tabla de origen, host, método y URI. Úsala para reconstruir actividad web sin abrir cada paquete.',
    },
  ],
  volatility3: [
    {
      title: 'Listar procesos y conexiones',
      kind: 'blue',
      code: 'volatility3 -f memoria.raw windows.pslist\\nvolatility3 -f memoria.raw windows.netstat',
      explain: 'Correlaciona procesos con conexiones de red. Un proceso sin ruta o con conexión saliente anómala merece análisis.',
    },
    {
      title: 'Buscar credenciales en memoria',
      kind: 'blue',
      code: 'volatility3 -f memoria.raw windows.hashdump',
      explain: 'Extrae hashes locales del volcado. En DFIR sirve para evaluar impacto; rota las credenciales y protege el resultado.',
    },
  ],
  yara: [
    {
      title: 'Escanear un directorio con reglas propias',
      kind: 'blue',
      code: 'yara -r reglas.yar /tmp/muestras',
      explain: 'Aplica todas las reglas de forma recursiva. Empieza con reglas de alta confianza para evitar una lluvia de falsos positivos.',
    },
    {
      title: 'Ver la cadena que activó la regla',
      kind: 'blue',
      code: 'yara -s -r reglas.yar muestra.bin',
      explain: 'Muestra los offsets y cadenas coincidentes. Ayuda a validar la regla antes de incorporarla a producción.',
    },
  ],
  chisel: [
    {
      title: 'Túnel SOCKS a través de un pivot',
      kind: 'red',
      code: '# servidor\\nchisel server -p 8080 --reverse\\n# cliente en el host pivote\\nchisel client 10.10.14.2:8080 R:socks',
      explain: 'Crea un proxy SOCKS en el servidor a través del cliente. Usa solo hosts propios y cifra el canal con TLS en producción.',
    },
    {
      title: 'Redirigir un puerto concreto',
      kind: 'network',
      code: 'chisel client 10.10.14.2:8080 8081:127.0.0.1:80',
      explain: 'Expone el puerto 80 del host remoto en el 8081 local. Verifica qué servicio hay antes de publicarlo.',
    },
  ],
  openssl: [
    {
      title: 'Comprobar la cadena TLS completa',
      kind: 'blue',
      code: 'openssl s_client -connect ejemplo.com:443 -servername ejemplo.com -showcerts </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates',
      explain: 'Obtiene el certificado presentado y muestra sujeto, emisor y validez. Repite con -tls1_2 y -tls1_3 para comprobar versiones.',
    },
    {
      title: 'Verificar una firma',
      kind: 'admin',
      code: 'openssl dgst -sha256 archivo.tar.gz\\nopenssl dgst -sha256 -verify clave-publica.pem -signature archivo.sig archivo.tar.gz',
      explain: 'Calcula el hash y valida la firma con la clave pública. Confirma la procedencia de la clave antes de confiar en el resultado.',
    },
  ],
};
