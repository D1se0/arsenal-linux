import type { CommandSuboption } from '../types';

/**
 * Opciones discretas de parámetros que ya existen en las fichas.
 * Se aplican por ID de comando y por la flag exacta, de modo que el contenido
 * histórico no necesita reescribirse para ganar subparámetros desplegables.
 */
export const PARAM_OPTIONS: Record<string, Record<string, CommandSuboption[]>> = {
  nmap: {
    '--script <nombre>': [
      { value: 'default', desc: 'Scripts seguros y habituales: banners, títulos HTTP y comprobaciones básicas.', example: 'nmap -sV --script default 10.10.10.5' },
      { value: 'safe', desc: 'Solo scripts que no deberían alterar el servicio ni provocar caídas.', example: 'nmap -sV --script safe -p 80,443 10.10.10.5' },
      { value: 'discovery', desc: 'Descubre recursos, rutas, usuarios y servicios sin buscar exploits.', example: 'nmap --script discovery -p 445 10.10.10.5' },
      { value: 'auth', desc: 'Comprueba autenticación, credenciales por defecto y métodos de acceso.', example: 'nmap --script auth -p 21,22,80 10.10.10.5' },
      { value: 'brute', desc: 'Fuerza bruta credenciales. Es ruidoso y puede bloquear cuentas.', example: 'nmap --script brute -p 22 10.10.10.5' },
      { value: 'vuln', desc: 'Busca vulnerabilidades conocidas. Los hallazgos requieren validación manual.', example: 'nmap -sV --script vuln 10.10.10.5' },
      { value: 'exploit', desc: 'Intenta explotar vulnerabilidades. Solo en laboratorio o con autorización explícita.', example: 'nmap --script exploit -p 445 10.10.10.5' },
      { value: 'intrusive', desc: 'Scripts que pueden afectar al servicio, consumir recursos o dejar rastro.', example: 'nmap --script intrusive -p 80 10.10.10.5' },
      { value: 'malware', desc: 'Busca indicios de malware, backdoors y servicios de puerta trasera.', example: 'nmap --script malware -p 1-1000 10.10.10.5' },
      { value: 'external', desc: 'Consulta servicios externos de reputación o inteligencia.', example: 'nmap --script external 10.10.10.5' },
      { value: 'http-enum', desc: 'Enumera rutas y paneles web habituales.', example: 'nmap -p 80 --script http-enum 10.10.10.5' },
      { value: 'http-title', desc: 'Obtiene el título de las páginas HTTP y HTTPS.', example: 'nmap -p 80,443 --script http-title 10.10.10.5' },
      { value: 'http-headers', desc: 'Muestra cabeceras HTTP y permite revisar configuraciones de seguridad.', example: 'nmap -p 80 --script http-headers 10.10.10.5' },
      { value: 'smb-os-discovery', desc: 'Obtiene nombre de equipo, dominio y versión de Windows por SMB.', example: 'nmap -p 445 --script smb-os-discovery 10.10.10.5' },
      { value: 'smb-vuln-ms17-010', desc: 'Comprueba si SMB es vulnerable a EternalBlue; no explota por sí solo.', example: 'nmap -p 445 --script smb-vuln-ms17-010 10.10.10.5' },
      { value: 'ssl-heartbleed', desc: 'Detecta la vulnerabilidad Heartbleed en TLS.', example: 'nmap -p 443 --script ssl-heartbleed 10.10.10.5' },
      { value: 'ssh-auth-methods', desc: 'Lista los métodos de autenticación aceptados por SSH.', example: 'nmap -p 22 --script ssh-auth-methods 10.10.10.5' },
      { value: 'dns-zone-transfer', desc: 'Intenta una transferencia de zona DNS; solo debe funcionar mal configurado.', example: 'nmap -p 53 --script dns-zone-transfer --script-args dns-zone-transfer.domain=ejemplo.com 10.10.10.5' },
      { value: 'ftp-anon', desc: 'Comprueba si el servidor FTP permite acceso anónimo.', example: 'nmap -p 21 --script ftp-anon 10.10.10.5' },
      { value: 'vulners', desc: 'Cruza versiones detectadas con la base de vulnerabilidades Vulners.', example: 'nmap -sV --script vulners 10.10.10.5' },
    ],
    '-T<0-5>': [
      { value: 'T0', desc: 'Paranoico: un puerto cada cinco minutos. Prácticamente indetectable, muy lento.', example: 'nmap -T0 -p 22,80 10.10.10.5' },
      { value: 'T1', desc: 'Sigiloso: pausas largas, pensado para evasión y redes frágiles.', example: 'nmap -T1 -p 22,80 10.10.10.5' },
      { value: 'T2', desc: 'Cortés: reduce la carga y el ruido en redes monitorizadas.', example: 'nmap -T2 -p 22,80 10.10.10.5' },
      { value: 'T3', desc: 'Normal: equilibrio por defecto entre velocidad y discreción.', example: 'nmap -T3 -sV 10.10.10.5' },
      { value: 'T4', desc: 'Agresivo: acelera en redes fiables y es el modo habitual de pentest.', example: 'nmap -T4 -sV -p- 10.10.10.5' },
      { value: 'T5', desc: 'Insano: máxima velocidad; puede perder puertos y saturar equipos.', example: 'nmap -T5 -p 1-1000 10.10.10.5' },
    ],
  },

  john: {
    '--format=<formato>': [
      { value: 'raw-md5', desc: 'Hash MD5 sin sal; rápido de crackear y considerado obsoleto. Muy rápido de crackear con GPU.', example: 'john --format=raw-md5 hashes.txt' },
      { value: 'raw-sha1', desc: 'SHA-1 sin sal; también rápido y considerado obsoleto para contraseñas.', example: 'john --format=raw-sha1 hashes.txt' },
      { value: 'raw-sha256', desc: 'SHA-256 sin sal, habitual en aplicaciones y APIs antiguas.', example: 'john --format=raw-sha256 hashes.txt' },
      { value: 'raw-sha512', desc: 'SHA-512 sin sal; más costoso que SHA-256 pero paralelizable.', example: 'john --format=raw-sha512 hashes.txt' },
      { value: 'nt', desc: 'Hash NTLM de Windows, el formato de los volcados SAM y LSASS.', example: 'john --format=nt ntlm.txt --wordlist=rockyou.txt' },
      { value: 'lm', desc: 'LAN Manager, algoritmo legacy de Windows, extremadamente débil.', example: 'john --format=lm lm.txt' },
      { value: 'sha512crypt', desc: 'Formato de /etc/shadow en Linux basado en SHA-512 con sal.', example: 'john --format=sha512crypt shadow.txt' },
      { value: 'bcrypt', desc: 'Formato lento y con sal; requiere diccionarios muy ajustados.', example: 'john --format=bcrypt bcrypt.txt' },
      { value: 'ssh', desc: 'Clave privada SSH cifrada extraída con ssh2john.', example: 'john --format=ssh id_rsa.hash' },
      { value: 'zip', desc: 'Archivo ZIP protegido convertido con zip2john.', example: 'john --format=zip backup.hash' },
      { value: 'rar', desc: 'Archivo RAR protegido convertido con rar2john.', example: 'john --format=rar archivo.hash' },
      { value: 'pdf', desc: 'PDF cifrado convertido con pdf2john.', example: 'john --format=pdf documento.hash' },
      { value: 'wpapsk', desc: 'Handshake WPA/WPA2 convertido con hcxpcapngtool o wpapcap2john.', example: 'john --format=wpapsk wpa.hash' },
      { value: 'keepass', desc: 'Base de datos KeePass convertida con keepass2john.', example: 'john --format=keepass keepass.hash' },
    ],
    '--incremental': [
      { value: 'All', desc: 'Prueba todo el espacio de caracteres configurado. Es la opción más completa y lenta.', example: 'john --incremental=All hashes.txt' },
      { value: 'ASCII', desc: 'Caracteres ASCII imprimibles; buen punto de partida para pruebas generales.', example: 'john --incremental=ASCII hashes.txt' },
      { value: 'Digits', desc: 'Solo dígitos, útil para PIN y contraseñas numéricas.', example: 'john --incremental=Digits hashes.txt' },
      { value: 'Lower', desc: 'Solo minúsculas; reduce mucho el espacio si la política lo permite.', example: 'john --incremental=Lower hashes.txt' },
      { value: 'Upper', desc: 'Solo mayúsculas, para políticas o patrones concretos.', example: 'john --incremental=Upper hashes.txt' },
      { value: 'Alnum', desc: 'Letras y números, sin símbolos; equilibrio para políticas corporativas.', example: 'john --incremental=Alnum hashes.txt' },
    ],
    '--mask=<patrón>': [
      { value: '?l', desc: 'Representa una letra minúscula en la máscara.', example: 'john --mask=?l?l?l?l hashes.txt' },
      { value: '?u', desc: 'Representa una letra mayúscula en la máscara.', example: 'john --mask=?u?l?l?l hashes.txt' },
      { value: '?d', desc: 'Representa un dígito del 0 al 9 en la máscara.', example: 'john --mask=?u?l?l?l?l?d?d hashes.txt' },
      { value: '?s', desc: 'Un símbolo ASCII, como !, @, # o $.', example: 'john --mask=?u?l?l?l?l?d?d?s hashes.txt' },
      { value: '?a', desc: 'Cualquier carácter imprimible; el conjunto más amplio.', example: 'john --mask=?a?a?a?a?a hashes.txt' },
      { value: '?1', desc: 'Referencia a un conjunto personalizado definido con --custom-charset1.', example: 'john --custom-charset1=abc123 --mask=?1?1?1?1 hashes.txt' },
    ],
  },

  hashcat: {
    '-m <modo>': [
      { value: '0', desc: 'Hash MD5 sin sal; rápido de crackear y considerado obsoleto.', example: 'hashcat -m 0 -a 0 hashes.txt rockyou.txt' },
      { value: '100', desc: 'Hash SHA-1 sin sal; rápido y también obsoleto para contraseñas.', example: 'hashcat -m 100 -a 0 hashes.txt rockyou.txt' },
      { value: '1400', desc: 'Hash SHA-256 sin sal, común en APIs y aplicaciones antiguas.', example: 'hashcat -m 1400 -a 0 hashes.txt rockyou.txt' },
      { value: '1700', desc: 'Hash SHA-512 sin sal; más costoso, pero paralelizable.', example: 'hashcat -m 1700 -a 0 hashes.txt rockyou.txt' },
      { value: '1000', desc: 'NTLM de Windows; el modo habitual para volcados SAM.', example: 'hashcat -m 1000 -a 0 ntlm.txt rockyou.txt' },
      { value: '3000', desc: 'LM, algoritmo legacy de Windows.', example: 'hashcat -m 3000 -a 0 lm.txt rockyou.txt' },
      { value: '1800', desc: 'sha512crypt de Linux, formato de /etc/shadow moderno.', example: 'hashcat -m 1800 -a 0 shadow.txt rockyou.txt' },
      { value: '3200', desc: 'bcrypt, lento y con sal; requiere un diccionario muy dirigido.', example: 'hashcat -m 3200 -a 0 bcrypt.txt rockyou.txt' },
      { value: '5600', desc: 'NetNTLMv2 capturado con Responder o un relay.', example: 'hashcat -m 5600 -a 0 netntlm.txt rockyou.txt' },
      { value: '13100', desc: 'Ticket Kerberos TGS, habitual en Kerberoasting.', example: 'hashcat -m 13100 -a 0 tgs.txt rockyou.txt' },
      { value: '18200', desc: 'AS-REP Roasting de Kerberos.', example: 'hashcat -m 18200 -a 0 asrep.txt rockyou.txt' },
      { value: '22000', desc: 'WPA/WPA2 handshake o PMKID en formato moderno.', example: 'hashcat -m 22000 -a 0 wpa.hc22000 rockyou.txt' },
      { value: '13400', desc: 'KeePass 1/2, base de datos de contraseñas.', example: 'hashcat -m 13400 -a 0 keepass.hash rockyou.txt' },
      { value: '11600', desc: '7-Zip, archivo comprimido protegido.', example: 'hashcat -m 11600 -a 0 archivo.7z.hash rockyou.txt' },
      { value: '13600', desc: 'WinZip, archivo ZIP protegido.', example: 'hashcat -m 13600 -a 0 archivo.zip.hash rockyou.txt' },
      { value: '10500', desc: 'PDF 1.4-1.6 con cifrado de documentos.', example: 'hashcat -m 10500 -a 0 documento.pdf.hash rockyou.txt' },
    ],
    '-a <modo>': [
      { value: '0', desc: 'Diccionario: prueba cada palabra de un fichero.', example: 'hashcat -m 1000 -a 0 hashes.txt rockyou.txt' },
      { value: '1', desc: 'Combinatoria: concatena palabras de dos diccionarios.', example: 'hashcat -m 1000 -a 1 hashes.txt nombres.txt apellidos.txt' },
      { value: '3', desc: 'Máscara: recorre un patrón de caracteres definido.', example: 'hashcat -m 1000 -a 3 hashes.txt ?u?l?l?l?l?d?d' },
      { value: '6', desc: 'Híbrido palabra + máscara: añade sufijos a cada palabra.', example: 'hashcat -m 1000 -a 6 hashes.txt rockyou.txt ?d?d' },
      { value: '7', desc: 'Híbrido máscara + palabra: añade prefijos a cada palabra.', example: 'hashcat -m 1000 -a 7 hashes.txt ?d?d rockyou.txt' },
      { value: '8', desc: 'PRINCE: combina y muta palabras con un algoritmo probabilístico.', example: 'hashcat -m 1000 -a 8 hashes.txt words.txt' },
      { value: '9', desc: 'Asociación: relaciona dos conjuntos de candidatos.', example: 'hashcat -m 1000 -a 9 hashes.txt left.txt right.txt' },
    ],
    '-w <1-4>': [
      { value: '1', desc: 'Bajo: prioriza la respuesta del sistema; útil en portátiles o equipos compartidos.', example: 'hashcat -m 1000 -a 0 -w 1 hashes.txt rockyou.txt' },
      { value: '2', desc: 'Medio-bajo: reduce la carga sin renunciar a una velocidad razonable.', example: 'hashcat -m 1000 -a 0 -w 2 hashes.txt rockyou.txt' },
      { value: '3', desc: 'Medio: equilibrio por defecto entre rendimiento y uso de recursos.', example: 'hashcat -m 1000 -a 0 -w 3 hashes.txt rockyou.txt' },
      { value: '4', desc: 'Alto: maximiza la GPU; el escritorio puede volverse menos fluido.', example: 'hashcat -m 1000 -a 0 -w 4 hashes.txt rockyou.txt' },
    ],
    '-r <reglas>': [
      { value: 'best64.rule', desc: '64 mutaciones rápidas y muy rentables para diccionarios genéricos.', example: 'hashcat -m 1000 -a 0 hashes.txt rockyou.txt -r best64.rule' },
      { value: 'dive.rule', desc: 'Reglas más agresivas; buena cobertura a costa de velocidad.', example: 'hashcat -m 1000 -a 0 hashes.txt rockyou.txt -r dive.rule' },
      { value: 'rockyou-30000.rule', desc: 'Treinta mil transformaciones inspiradas en filtraciones reales.', example: 'hashcat -m 1000 -a 0 hashes.txt rockyou.txt -r rockyou-30000.rule' },
      { value: 'OneRuleToRuleThemAll.rule', desc: 'Conjunto comunitario muy completo; requiere más tiempo de GPU.', example: 'hashcat -m 1000 -a 0 hashes.txt rockyou.txt -r OneRuleToRuleThemAll.rule' },
    ],
  },

  curl: {
    '-X <método>': [
      { value: 'GET', desc: 'Solicita un recurso sin cuerpo. Es el método por defecto.', example: 'curl -X GET https://api.ejemplo.com/usuarios' },
      { value: 'POST', desc: 'Envía datos para crear un recurso o ejecutar una acción.', example: 'curl -X POST -d @datos.json https://api.ejemplo.com/usuarios' },
      { value: 'PUT', desc: 'Reemplaza un recurso completo; suele requerir el cuerpo entero.', example: 'curl -X PUT -d @datos.json https://api.ejemplo.com/usuarios/7' },
      { value: 'PATCH', desc: 'Modifica parcialmente un recurso.', example: 'curl -X PATCH -d @cambio.json https://api.ejemplo.com/usuarios/7' },
      { value: 'DELETE', desc: 'Elimina un recurso. Verifica dos veces el objetivo.', example: 'curl -X DELETE https://api.ejemplo.com/usuarios/7' },
      { value: 'HEAD', desc: 'Obtiene solo cabeceras, sin cuerpo; útil para comprobar estado y tamaño.', example: 'curl -I https://ejemplo.com' },
      { value: 'OPTIONS', desc: 'Consulta los métodos y capacidades que anuncia el servidor.', example: 'curl -X OPTIONS -i https://ejemplo.com/api' },
    ],
    '-H <cabecera>': [
      { value: 'Authorization: Bearer <token>', desc: 'Envía un token de acceso OAuth/JWT en la cabecera.', example: 'curl -H "Authorization: Bearer $TOKEN" https://api.ejemplo.com/me' },
      { value: 'Content-Type: application/json', desc: 'Declara que el cuerpo es JSON; imprescindible en muchas APIs.', example: 'curl -H "Content-Type: application/json" -d @datos.json https://api.ejemplo.com' },
      { value: 'Accept: application/json', desc: 'Pide una representación JSON de la respuesta.', example: 'curl -H "Accept: application/json" https://api.ejemplo.com' },
      { value: 'User-Agent: <valor>', desc: 'Identifica el cliente; algunos servidores filtran por usuario.', example: 'curl -H "User-Agent: Arsenal-Audit/1.0" https://ejemplo.com' },
      { value: 'X-Forwarded-For: <ip>', desc: 'Simula la IP de origen detrás de un proxy. Solo para pruebas autorizadas.', example: 'curl -H "X-Forwarded-For: 127.0.0.1" https://ejemplo.com/admin' },
      { value: 'Cookie: <nombre=valor>', desc: 'Envía cookies de sesión de forma explícita.', example: 'curl -H "Cookie: session=abc123" https://ejemplo.com/panel' },
    ],
    '-w <formato>': [
      { value: '%{http_code}', desc: 'Código de estado HTTP de la última respuesta.', example: 'curl -s -o /dev/null -w "%{http_code}\\n" https://ejemplo.com' },
      { value: '%{url_effective}', desc: 'URL final después de redirecciones.', example: 'curl -sL -o /dev/null -w "%{url_effective}\\n" https://ejemplo.com' },
      { value: '%{time_total}', desc: 'Tiempo total de la petición en segundos.', example: 'curl -s -o /dev/null -w "%{time_total}\\n" https://ejemplo.com' },
      { value: '%{size_download}', desc: 'Bytes descargados en el cuerpo de la respuesta.', example: 'curl -s -o /dev/null -w "%{size_download}\\n" https://ejemplo.com' },
      { value: '%{content_type}', desc: 'Tipo MIME devuelto por el servidor.', example: 'curl -s -o /dev/null -w "%{content_type}\\n" https://ejemplo.com' },
      { value: '%{remote_ip}', desc: 'Dirección IP del servidor que atendió la conexión.', example: 'curl -s -o /dev/null -w "%{remote_ip}\\n" https://ejemplo.com' },
    ],
  },

  ffuf: {
    '-mc <códigos>': [
      { value: '200', desc: 'Respuesta correcta; muestra recursos accesibles.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -mc 200' },
      { value: '204', desc: 'Sin contenido, habitual en endpoints de API que no devuelven cuerpo.', example: 'ffuf -u https://api.ejemplo.com/FUZZ -w lista.txt -mc 204' },
      { value: '301,302', desc: 'Redirecciones; pueden revelar paneles, HTTPS forzado o rutas internas.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -mc 301,302' },
      { value: '401', desc: 'Requiere autenticación; confirma que el recurso existe.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -mc 401' },
      { value: '403', desc: 'Prohibido; el recurso existe pero no tienes permiso.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -mc 403' },
      { value: '405', desc: 'Método no permitido; útil para descubrir endpoints que solo aceptan POST.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -mc 405' },
      { value: '500', desc: 'Error del servidor; puede indicar una entrada que rompe la aplicación.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -mc 500' },
      { value: 'all', desc: 'Muestra todos los códigos; útil solo con filtros adicionales.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -mc all -fs 0' },
    ],
    '-X <método>': [
      { value: 'GET', desc: 'Solicita recursos y rutas.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -X GET' },
      { value: 'POST', desc: 'Prueba endpoints que esperan un cuerpo.', example: 'ffuf -u https://ejemplo.com/api/FUZZ -w lista.txt -X POST -d "id=1"' },
      { value: 'PUT', desc: 'Prueba creación o reemplazo de recursos.', example: 'ffuf -u https://ejemplo.com/api/FUZZ -w lista.txt -X PUT -d "{}"' },
      { value: 'PATCH', desc: 'Prueba actualizaciones parciales.', example: 'ffuf -u https://ejemplo.com/api/FUZZ -w lista.txt -X PATCH -d "{}"' },
      { value: 'DELETE', desc: 'Prueba borrado de recursos; extremadamente destructivo.', example: 'ffuf -u https://ejemplo.com/api/FUZZ -w lista.txt -X DELETE' },
      { value: 'HEAD', desc: 'Comprueba existencia sin descargar el cuerpo.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -X HEAD' },
      { value: 'OPTIONS', desc: 'Descubre métodos permitidos por el servidor.', example: 'ffuf -u https://ejemplo.com/FUZZ -w lista.txt -X OPTIONS' },
    ],
    '-w <wordlist>': [
      { value: 'raft-medium-directories.txt', desc: 'Directorios comunes de SecLists, buen equilibrio.', example: 'ffuf -u https://ejemplo.com/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt' },
      { value: 'raft-medium-files.txt', desc: 'Nombres de archivos comunes, útil para backups y configuraciones.', example: 'ffuf -u https://ejemplo.com/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-files.txt' },
      { value: 'common.txt', desc: 'Lista corta de dirb, rápida para una primera pasada.', example: 'ffuf -u https://ejemplo.com/FUZZ -w /usr/share/wordlists/dirb/common.txt' },
      { value: 'subdomains-top1million-5000.txt', desc: 'Subdominios frecuentes para vhost o DNS.', example: 'ffuf -u https://FUZZ.ejemplo.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt' },
      { value: 'api-endpoints.txt', desc: 'Lista propia de rutas de API adaptada al stack auditado.', example: 'ffuf -u https://api.ejemplo.com/FUZZ -w api-endpoints.txt' },
    ],
  },

  gobuster: {
    '-x <ext>': [
      { value: 'php', desc: 'Busca archivos PHP y backups asociados.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -x php' },
      { value: 'html', desc: 'Incluye páginas y plantillas HTML.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -x html' },
      { value: 'js', desc: 'Localiza scripts que pueden contener endpoints y claves.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -x js' },
      { value: 'json', desc: 'Busca respuestas y configuraciones JSON expuestas.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -x json' },
      { value: 'bak,old,txt', desc: 'Extensiones típicas de copias y notas olvidadas.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -x bak,old,txt' },
      { value: 'zip,tar,gz', desc: 'Archivos comprimidos que pueden contener código o datos.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -x zip,tar,gz' },
    ],
    '-b <códigos>': [
      { value: '404', desc: 'Oculta el “no encontrado” estándar.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -b 404' },
      { value: '403', desc: 'Oculta recursos prohibidos si no interesan; recuerda que un 403 confirma existencia.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -b 403' },
      { value: '301,302', desc: 'Oculta redirecciones cuando solo buscas contenido directo.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -b 301,302' },
      { value: '404,403,500', desc: 'Filtra errores y negativas para quedarte con respuestas útiles.', example: 'gobuster dir -u https://ejemplo.com -w lista.txt -b 404,403,500' },
    ],
  },

  feroxbuster: {
    '-x <ext>': [
      { value: 'php', desc: 'Añade PHP a cada palabra.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt -x php' },
      { value: 'html', desc: 'Prueba páginas y plantillas con extensión .html.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt -x html' },
      { value: 'js', desc: 'Busca JavaScript y posibles endpoints embebidos.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt -x js' },
      { value: 'json', desc: 'Busca respuestas JSON y configuraciones.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt -x json' },
      { value: 'bak,old', desc: 'Busca copias de seguridad y versiones antiguas.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt -x bak,old' },
    ],
    '--filter-status <códigos>': [
      { value: '404', desc: 'Filtra el “no encontrado” estándar.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt --filter-status 404' },
      { value: '403', desc: 'Filtra prohibidos cuando no interesan.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt --filter-status 403' },
      { value: '500,502,503', desc: 'Filtra errores del servidor para reducir ruido.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt --filter-status 500,502,503' },
      { value: '301,302', desc: 'Filtra redirecciones si solo buscas contenido directo.', example: 'feroxbuster -u https://ejemplo.com -w lista.txt --filter-status 301,302' },
    ],
  },

  sqlmap: {
    '--dbms <motor>': [
      { value: 'mysql', desc: 'Fuerza las pruebas para MySQL/MariaDB.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --dbms=mysql --dbs' },
      { value: 'mssql', desc: 'Fuerza el motor Prueba credenciales contra Microsoft SQL Server.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --dbms=mssql --dbs' },
      { value: 'postgresql', desc: 'Fuerza las pruebas contra PostgreSQL.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --dbms=postgresql --dbs' },
      { value: 'oracle', desc: 'Fuerza Oracle; las consultas y tiempos cambian.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --dbms=oracle --dbs' },
      { value: 'sqlite', desc: 'Fuerza SQLite, habitual en aplicaciones locales.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --dbms=sqlite --dbs' },
      { value: 'mariadb', desc: 'Fuerza MariaDB cuando el fingerprint no es concluyente.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --dbms=mariadb --dbs' },
    ],
    '--level <1-5>': [
      { value: '1', desc: 'Solo parámetros y vectores más evidentes; rápido y discreto.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --level=1' },
      { value: '2', desc: 'Incluye más cabeceras y parámetros además de la URL.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --level=2' },
      { value: '3', desc: 'Amplía User-Agent, Referer y otros puntos de entrada.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --level=3' },
      { value: '4', desc: 'Prueba más cabeceras y combinaciones; más lento y ruidoso.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --level=4' },
      { value: '5', desc: 'Máxima cobertura, incluidos parámetros menos habituales.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --level=5 --risk=2' },
    ],
    '--risk <1-3>': [
      { value: '1', desc: 'Pruebas seguras que no deberían modificar datos.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --risk=1' },
      { value: '2', desc: 'Añade pruebas que pueden ser más agresivas con la base de datos.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --risk=2' },
      { value: '3', desc: 'Incluye técnicas que pueden bloquear tablas o afectar disponibilidad.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --risk=3' },
    ],
    '--technique <letras>': [
      { value: 'B', desc: 'Boolean-based blind: infiere datos con respuestas verdadero/falso.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --technique=B' },
      { value: 'E', desc: 'Error-based: provoca errores que revelan información.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --technique=E' },
      { value: 'U', desc: 'Union-based: combina consultas con UNION SELECT.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --technique=U' },
      { value: 'S', desc: 'Stacked queries: ejecuta varias sentencias si el motor lo permite.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --technique=S' },
      { value: 'T', desc: 'Time-based blind: mide retardos para inferir condiciones.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --technique=T' },
      { value: 'Q', desc: 'Inline queries: inserta subconsultas en la consulta original.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --technique=Q' },
    ],
    '--tamper <script>': [
      { value: 'space2comment', desc: 'Sustituye espacios por comentarios para evadir filtros simples.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --tamper=space2comment' },
      { value: 'between', desc: 'Reemplaza comparaciones por BETWEEN.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --tamper=between' },
      { value: 'randomcase', desc: 'Alterna mayúsculas y minúsculas en palabras clave.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --tamper=randomcase' },
      { value: 'charencode', desc: 'Codifica caracteres especiales para evitar firmas.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --tamper=charencode' },
      { value: 'modsecurityversioned', desc: 'Intenta evadir reglas de ModSecurity versionadas.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --tamper=modsecurityversioned' },
      { value: 'space2comment,between', desc: 'Combina varios scripts de evasión; revisa la compatibilidad.', example: 'sqlmap -u "https://ejemplo.com/?id=1" --tamper=space2comment,between' },
    ],
  },

  nikto: {
    '-Tuning <valor>': [
      { value: '1', desc: 'Pruebas interesantes: archivos expuestos y configuraciones débiles.', example: 'nikto -h https://ejemplo.com -Tuning 1' },
      { value: '2', desc: 'Errores de configuración y archivos por defecto.', example: 'nikto -h https://ejemplo.com -Tuning 2' },
      { value: '3', desc: 'Divulgación de información: versiones, rutas y metadatos.', example: 'nikto -h https://ejemplo.com -Tuning 3' },
      { value: '4', desc: 'Inyección de comandos y SQL.', example: 'nikto -h https://ejemplo.com -Tuning 4' },
      { value: '5', desc: 'Scripts CGI y rutas heredadas.', example: 'nikto -h https://ejemplo.com -Tuning 5' },
      { value: '6', desc: 'Métodos HTTP y técnicas de autenticación.', example: 'nikto -h https://ejemplo.com -Tuning 6' },
      { value: '7', desc: 'Divulgación de metadatos y ficheros de configuración.', example: 'nikto -h https://ejemplo.com -Tuning 7' },
      { value: '8', desc: 'Inyección de comandos en sistemas operativos.', example: 'nikto -h https://ejemplo.com -Tuning 8' },
      { value: '9', desc: 'Inyección SQL y pruebas relacionadas.', example: 'nikto -h https://ejemplo.com -Tuning 9' },
      { value: 'x', desc: 'Excluye las pruebas de divulgación de información.', example: 'nikto -h https://ejemplo.com -Tuning x' },
      { value: 'a', desc: 'Todas las pruebas, incluidas las más agresivas.', example: 'nikto -h https://ejemplo.com -Tuning a' },
      { value: 'b', desc: 'Pruebas de identificación de software y versiones.', example: 'nikto -h https://ejemplo.com -Tuning b' },
      { value: 'c', desc: 'Pruebas de inyección remota de comandos.', example: 'nikto -h https://ejemplo.com -Tuning c' },
    ],
    '-Format <formato>': [
      { value: 'html', desc: 'Informe HTML con tablas y enlaces, cómodo para entregar.', example: 'nikto -h https://ejemplo.com -o informe.html -Format html' },
      { value: 'csv', desc: 'CSV para hojas de cálculo o procesamiento posterior.', example: 'nikto -h https://ejemplo.com -o informe.csv -Format csv' },
      { value: 'json', desc: 'JSON estructurado para automatización.', example: 'nikto -h https://ejemplo.com -o informe.json -Format json' },
      { value: 'xml', desc: 'XML para integrarlo con herramientas de reporting.', example: 'nikto -h https://ejemplo.com -o informe.xml -Format xml' },
      { value: 'txt', desc: 'Texto plano, fácil de revisar y versionar.', example: 'nikto -h https://ejemplo.com -o informe.txt -Format txt' },
    ],
  },

  nuclei: {
    '-severity <niveles>': [
      { value: 'critical', desc: 'Solo hallazgos críticos; ideal para triage inmediato.', example: 'nuclei -u https://ejemplo.com -severity critical' },
      { value: 'high', desc: 'Vulnerabilidades de alto impacto.', example: 'nuclei -u https://ejemplo.com -severity high,critical' },
      { value: 'medium', desc: 'Riesgos medios que requieren contexto.', example: 'nuclei -u https://ejemplo.com -severity medium' },
      { value: 'low', desc: 'Hallazgos de baja severidad y hardening.', example: 'nuclei -u https://ejemplo.com -severity low' },
      { value: 'info', desc: 'Información de tecnologías, paneles y metadatos.', example: 'nuclei -u https://ejemplo.com -severity info' },
      { value: 'unknown', desc: 'Plantillas sin severidad asignada; revisa manualmente.', example: 'nuclei -u https://ejemplo.com -severity unknown' },
    ],
    '-t <plantilla|directorio>': [
      { value: 'cves', desc: 'Plantillas de CVE conocidos.', example: 'nuclei -u https://ejemplo.com -t cves' },
      { value: 'vulnerabilities', desc: 'Vulnerabilidades generales y de aplicación.', example: 'nuclei -u https://ejemplo.com -t vulnerabilities' },
      { value: 'misconfiguration', desc: 'Configuraciones inseguras y servicios expuestos.', example: 'nuclei -u https://ejemplo.com -t misconfiguration' },
      { value: 'exposures', desc: 'Archivos, paneles y secretos expuestos.', example: 'nuclei -u https://ejemplo.com -t exposures' },
      { value: 'default-logins', desc: 'Credenciales por defecto en paneles y servicios.', example: 'nuclei -u https://ejemplo.com -t default-logins' },
      { value: 'takeovers', desc: 'Posibles secuestros de subdominios.', example: 'nuclei -l subdominios.txt -t takeovers' },
      { value: 'technologies', desc: 'Detección de tecnologías y fingerprint.', example: 'nuclei -u https://ejemplo.com -t technologies' },
    ],
  },

  hydra: {
    '-e nsr': [
      { value: 'n', desc: 'Prueba una contraseña vacía antes del diccionario.', example: 'hydra -l admin -e n ssh://10.10.10.5' },
      { value: 's', desc: 'Prueba la contraseña igual al nombre de usuario.', example: 'hydra -l admin -e s ssh://10.10.10.5' },
      { value: 'r', desc: 'Prueba la contraseña invertida respecto al usuario.', example: 'hydra -l admin -e r ssh://10.10.10.5' },
    ],
  },

  medusa: {
    '-M <módulo>': [
      { value: 'ssh', desc: 'Prueba credenciales contra el servicio SSH.', example: 'medusa -h 10.10.10.5 -u admin -P pass.txt -M ssh' },
      { value: 'ftp', desc: 'Prueba credenciales contra el servicio FTP.', example: 'medusa -h 10.10.10.5 -u admin -P pass.txt -M ftp' },
      { value: 'http', desc: 'Formulario o autenticación HTTP.', example: 'medusa -h ejemplo.com -u admin -P pass.txt -M http' },
      { value: 'smbnt', desc: 'SMB en Windows NT y versiones posteriores.', example: 'medusa -h 10.10.10.5 -u admin -P pass.txt -M smbnt' },
      { value: 'rdp', desc: 'Escritorio remoto de Windows.', example: 'medusa -h 10.10.10.5 -u admin -P pass.txt -M rdp' },
      { value: 'mysql', desc: 'Base de datos MySQL/MariaDB.', example: 'medusa -h 10.10.10.5 -u root -P pass.txt -M mysql' },
      { value: 'mssql', desc: 'Prueba credenciales contra Microsoft SQL Server.', example: 'medusa -h 10.10.10.5 -u sa -P pass.txt -M mssql' },
      { value: 'vnc', desc: 'Prueba credenciales contra un servidor VNC.', example: 'medusa -h 10.10.10.5 -u root -P pass.txt -M vnc' },
      { value: 'imap', desc: 'Prueba credenciales contra un servidor de correo IMAP.', example: 'medusa -h 10.10.10.5 -u usuario -P pass.txt -M imap' },
      { value: 'pop3', desc: 'Prueba credenciales contra un servidor de correo POP3.', example: 'medusa -h 10.10.10.5 -u usuario -P pass.txt -M pop3' },
    ],
    '-e nsr': [
      { value: 'n', desc: 'Prueba una contraseña vacía contra la cuenta.', example: 'medusa -h 10.10.10.5 -u admin -e n -M ssh' },
      { value: 's', desc: 'Contraseña igual al usuario.', example: 'medusa -h 10.10.10.5 -u admin -e s -M ssh' },
      { value: 'r', desc: 'Contraseña invertida respecto al usuario.', example: 'medusa -h 10.10.10.5 -u admin -e r -M ssh' },
    ],
  },

  dirsearch: {
    '-e <extensiones>': [
      { value: 'php', desc: 'Añade la extensión .php a cada palabra del diccionario.', example: 'dirsearch -u https://ejemplo.com -e php' },
      { value: 'asp,aspx', desc: 'Añade tecnologías ASP.NET.', example: 'dirsearch -u https://ejemplo.com -e asp,aspx' },
      { value: 'jsp', desc: 'Añade la extensión .jsp para aplicaciones Java.', example: 'dirsearch -u https://ejemplo.com -e jsp' },
      { value: 'html,js', desc: 'Añade páginas y scripts del frontend.', example: 'dirsearch -u https://ejemplo.com -e html,js' },
      { value: 'bak,old,zip', desc: 'Busca copias y archivos comprimidos.', example: 'dirsearch -u https://ejemplo.com -e bak,old,zip' },
    ],
    '--exclude-status <códigos>': [
      { value: '404', desc: 'Excluye el no encontrado.', example: 'dirsearch -u https://ejemplo.com --exclude-status 404' },
      { value: '403', desc: 'Excluye prohibidos si no interesan.', example: 'dirsearch -u https://ejemplo.com --exclude-status 403' },
      { value: '500,502,503', desc: 'Excluye errores del servidor.', example: 'dirsearch -u https://ejemplo.com --exclude-status 500,502,503' },
    ],
  },

  wfuzz: {
    '-z <tipo>,<valor>': [
      { value: 'file,/ruta/lista.txt', desc: 'Carga cada línea de un diccionario.', example: 'wfuzz -w /ruta/lista.txt -u https://ejemplo.com/FUZZ' },
      { value: 'list,admin,api,backup', desc: 'Usa una lista de valores en línea.', example: 'wfuzz -z list,admin-api-backup -u https://ejemplo.com/FUZZ' },
      { value: 'range,1-100', desc: 'Genera un rango numérico.', example: 'wfuzz -z range,1-100 -u https://ejemplo.com/?id=FUZZ' },
      { value: 'hexrange,00-ff', desc: 'Genera valores hexadecimales.', example: 'wfuzz -z hexrange,00-ff -u https://ejemplo.com/?id=FUZZ' },
      { value: 'permutation,abc', desc: 'Genera permutaciones de los caracteres indicados.', example: 'wfuzz -z permutation,abc -u https://ejemplo.com/FUZZ' },
      { value: 'buffer_overflow,1000', desc: 'Envía cadenas de longitud creciente para probar desbordamientos.', example: 'wfuzz -z buffer_overflow,1000 -u https://ejemplo.com/?id=FUZZ' },
    ],
    '--hc <códigos>': [
      { value: '404', desc: 'Oculta respuestas no encontradas.', example: 'wfuzz -w lista.txt -u https://ejemplo.com/FUZZ --hc 404' },
      { value: '403', desc: 'Oculta respuestas 403 de recursos prohibidos.', example: 'wfuzz -w lista.txt -u https://ejemplo.com/FUZZ --hc 403' },
      { value: '301,302', desc: 'Oculta respuestas de redirección 301 y 302.', example: 'wfuzz -w lista.txt -u https://ejemplo.com/FUZZ --hc 301,302' },
    ],
  },

  wpscan: {
    '--enumerate vp': [
      { value: 'vp', desc: 'Enumera plugins con vulnerabilidades conocidas.', example: 'wpscan --url https://wp.ejemplo.com --enumerate vp' },
      { value: 'vt', desc: 'Enumera temas con vulnerabilidades conocidas.', example: 'wpscan --url https://wp.ejemplo.com --enumerate vt' },
      { value: 'tt', desc: 'Temas totales, no solo vulnerables.', example: 'wpscan --url https://wp.ejemplo.com --enumerate tt' },
      { value: 'cb', desc: 'Configuraciones de backup.', example: 'wpscan --url https://wp.ejemplo.com --enumerate cb' },
      { value: 'dbe', desc: 'Exportación de base de datos.', example: 'wpscan --url https://wp.ejemplo.com --enumerate dbe' },
      { value: 'u', desc: 'Enumera nombres de usuario del sitio WordPress.', example: 'wpscan --url https://wp.ejemplo.com --enumerate u' },
      { value: 'm', desc: 'Medios y archivos subidos.', example: 'wpscan --url https://wp.ejemplo.com --enumerate m' },
      { value: 'p', desc: 'Enumera plugins populares, aunque no tengan CVEs.', example: 'wpscan --url https://wp.ejemplo.com --enumerate p' },
    ],
  },

  whatweb: {
    '-a <nivel>': [
      { value: '1', desc: 'Una petición por URL; modo pasivo y rápido.', example: 'whatweb -a 1 https://ejemplo.com' },
      { value: '2', desc: 'Añade peticiones para confirmar tecnologías.', example: 'whatweb -a 2 https://ejemplo.com' },
      { value: '3', desc: 'Mayor agresividad y más firmas; puede generar más ruido.', example: 'whatweb -a 3 https://ejemplo.com' },
      { value: '4', desc: 'Máximo nivel de agresividad; solo con autorización.', example: 'whatweb -a 4 https://ejemplo.com' },
    ],
  },

  testssl: {
    '--severity <nivel>': [
      { value: 'LOW', desc: 'Muestra hallazgos de severidad baja o superior.', example: 'testssl --severity LOW https://ejemplo.com' },
      { value: 'MEDIUM', desc: 'Muestra hallazgos medios, altos y críticos.', example: 'testssl --severity MEDIUM https://ejemplo.com' },
      { value: 'HIGH', desc: 'Muestra altos y críticos.', example: 'testssl --severity HIGH https://ejemplo.com' },
      { value: 'CRITICAL', desc: 'Muestra únicamente los problemas críticos.', example: 'testssl --severity CRITICAL https://ejemplo.com' },
      { value: 'OK', desc: 'Incluye también comprobaciones correctas.', example: 'testssl --severity OK https://ejemplo.com' },
    ],
  },

  openssl: {
    's_client -connect <host:puerto>': [
      { value: '-servername <host>', desc: 'Envía SNI para seleccionar el certificado virtual correcto.', example: 'openssl s_client -connect ejemplo.com:443 -servername ejemplo.com' },
      { value: '-tls1_2', desc: 'Fuerza TLS 1.2 para comprobar compatibilidad.', example: 'openssl s_client -connect ejemplo.com:443 -tls1_2' },
      { value: '-tls1_3', desc: 'Fuerza TLS 1.3 para comprobar si el servidor lo soporta.', example: 'openssl s_client -connect ejemplo.com:443 -tls1_3' },
      { value: '-showcerts', desc: 'Muestra toda la cadena de certificados enviada por el servidor.', example: 'openssl s_client -connect ejemplo.com:443 -showcerts' },
      { value: '-brief', desc: 'Resume el handshake y el resultado de la verificación.', example: 'openssl s_client -connect ejemplo.com:443 -brief' },
      { value: '-verify_return_error', desc: 'Falla si la verificación del certificado no es correcta.', example: 'openssl s_client -connect ejemplo.com:443 -verify_return_error' },
    ],
  },

  journalctl: {
    '-p <prioridad>': [
      { value: '0', desc: 'emerg: el sistema es inutilizable.', example: 'journalctl -p 0 -b' },
      { value: '1', desc: 'alert: requiere acción inmediata.', example: 'journalctl -p 1 -b' },
      { value: '2', desc: 'crit: fallo crítico que compromete un servicio o el sistema.', example: 'journalctl -p 2 -b' },
      { value: '3', desc: 'err: error de servicio o aplicación.', example: 'journalctl -p 3 --since today' },
      { value: '4', desc: 'warning: advertencia que puede preceder a un fallo.', example: 'journalctl -p 4 --since "1 hour ago"' },
      { value: '5', desc: 'notice: evento significativo pero normal.', example: 'journalctl -p 5 -b' },
      { value: '6', desc: 'info: información general.', example: 'journalctl -p 6 -u nginx' },
      { value: '7', desc: 'debug: detalle de depuración.', example: 'journalctl -p 7 -u mi-servicio' },
    ],
    '-o json': [
      { value: 'short', desc: 'Formato de una línea, legible por humanos.', example: 'journalctl -o short -u nginx' },
      { value: 'short-iso', desc: 'Añade timestamps ISO 8601 completos.', example: 'journalctl -o short-iso --since today' },
      { value: 'verbose', desc: 'Muestra todos los campos del registro.', example: 'journalctl -o verbose -u nginx -n 1' },
      { value: 'json', desc: 'JSON compacto, ideal para jq.', example: 'journalctl -o json -u nginx | jq .' },
      { value: 'json-pretty', desc: 'JSON indentado para lectura manual.', example: 'journalctl -o json-pretty -u nginx -n 1' },
      { value: 'cat', desc: 'Solo el mensaje, sin metadatos.', example: 'journalctl -o cat -u nginx' },
      { value: 'export', desc: 'Formato binario exportable para otra máquina.', example: 'journalctl -o export -u nginx > nginx.journal' },
    ],
    '--since / --until': [
      { value: 'today', desc: 'Desde el inicio del día actual.', example: 'journalctl --since today' },
      { value: 'yesterday', desc: 'Desde el inicio del día anterior.', example: 'journalctl --since yesterday --until today' },
      { value: '"1 hour ago"', desc: 'Última hora; útil para incidentes recientes.', example: 'journalctl --since "1 hour ago" -p err' },
      { value: '"2026-01-01 08:00"', desc: 'Fecha y hora exactas de inicio.', example: 'journalctl --since "2026-01-01 08:00" --until "2026-01-01 10:00"' },
      { value: 'now', desc: 'Hasta el instante actual.', example: 'journalctl --since today --until now' },
    ],
  },

  ip: {
    'ip addr': [
      { value: 'show', desc: 'Lista direcciones de todas las interfaces.', example: 'ip addr show' },
      { value: 'add <ip>/<pref> dev <if>', desc: 'Añade una dirección a una interfaz.', example: 'sudo ip addr add 192.0.2.10/24 dev eth0' },
      { value: 'del <ip>/<pref> dev <if>', desc: 'Elimina una dirección IP concreta de la interfaz.', example: 'sudo ip addr del 192.0.2.10/24 dev eth0' },
      { value: 'flush dev <if>', desc: 'Elimina todas las direcciones de una interfaz.', example: 'sudo ip addr flush dev eth0' },
    ],
    'ip route': [
      { value: 'show', desc: 'Muestra la tabla de rutas principal.', example: 'ip route show' },
      { value: 'add <red> via <gw>', desc: 'Añade una ruta estática hacia una red por un gateway.', example: 'sudo ip route add 10.20.0.0/16 via 192.0.2.1' },
      { value: 'del <red>', desc: 'Elimina una ruta estática de la tabla de enrutamiento.', example: 'sudo ip route del 10.20.0.0/16' },
      { value: 'get <ip>', desc: 'Consulta por qué interfaz y gateway sale un destino.', example: 'ip route get 8.8.8.8' },
      { value: 'show table <tabla>', desc: 'Consulta una tabla de rutas concreta.', example: 'ip route show table main' },
    ],
  },

  ss: {
    'state <estado>': [
      { value: 'established', desc: 'Conexiones TCP establecidas en este momento.', example: 'ss -tnp state established' },
      { value: 'listening', desc: 'Sockets escuchando en un puerto.', example: 'ss -tlnp state listening' },
      { value: 'time-wait', desc: 'Conexiones cerradas esperando expiración.', example: 'ss -tan state time-wait' },
      { value: 'close-wait', desc: 'Conexiones cerradas por el otro extremo y pendientes de cerrar.', example: 'ss -tan state close-wait' },
      { value: 'syn-sent', desc: 'Intentos de conexión sin respuesta.', example: 'ss -tan state syn-sent' },
      { value: 'syn-recv', desc: 'Conexiones entrantes en negociación.', example: 'ss -tan state syn-recv' },
      { value: 'all', desc: 'Todos los estados disponibles.', example: 'ss -tan state all' },
    ],
  },

  iptables: {
    '-A <cadena>': [
      { value: 'INPUT', desc: 'Paquetes destinados al propio host.', example: 'sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT' },
      { value: 'OUTPUT', desc: 'Paquetes generados por el host.', example: 'sudo iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT' },
      { value: 'FORWARD', desc: 'Paquetes que atraviesan el host.', example: 'sudo iptables -A FORWARD -i eth0 -o eth1 -j ACCEPT' },
      { value: 'PREROUTING', desc: 'Cadena NAT antes del enrutado.', example: 'sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080' },
      { value: 'POSTROUTING', desc: 'Cadena NAT después del enrutado.', example: 'sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE' },
    ],
    '-j ACCEPT|DROP|REJECT|LOG': [
      { value: 'ACCEPT', desc: 'Permite el paquete y detiene el recorrido de la cadena.', example: 'sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT' },
      { value: 'DROP', desc: 'Descarta el paquete sin responder.', example: 'sudo iptables -A INPUT -p tcp --dport 23 -j DROP' },
      { value: 'REJECT', desc: 'Rechaza y responde con un ICMP o TCP reset.', example: 'sudo iptables -A INPUT -p tcp --dport 23 -j REJECT' },
      { value: 'LOG', desc: 'Registra el paquete y continúa con la siguiente regla.', example: 'sudo iptables -A INPUT -p tcp --dport 23 -j LOG --log-prefix "TELNET: "' },
      { value: 'MASQUERADE', desc: 'NAT de salida usando la IP de la interfaz.', example: 'sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE' },
      { value: 'SNAT', desc: 'Cambia la IP de origen de forma explícita.', example: 'sudo iptables -t nat -A POSTROUTING -o eth0 -j SNAT --to-source 192.0.2.10' },
      { value: 'DNAT', desc: 'Cambia la IP o puerto de destino.', example: 'sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 10.0.0.5:8080' },
      { value: 'RETURN', desc: 'Devuelve el procesamiento a la cadena anterior.', example: 'sudo iptables -A INPUT -s 10.0.0.0/8 -j RETURN' },
    ],
    '-m conntrack --ctstate <estado>': [
      { value: 'NEW', desc: 'Primer paquete de una conexión.', example: 'sudo iptables -A INPUT -m conntrack --ctstate NEW -p tcp --dport 22 -j ACCEPT' },
      { value: 'ESTABLISHED', desc: 'Parte de una conexión ya establecida.', example: 'sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT' },
      { value: 'RELATED', desc: 'Conexión relacionada, como FTP pasivo o ICMP de error.', example: 'sudo iptables -A INPUT -m conntrack --ctstate RELATED -j ACCEPT' },
      { value: 'INVALID', desc: 'Paquete que no pertenece a ninguna conexión conocida.', example: 'sudo iptables -A INPUT -m conntrack --ctstate INVALID -j DROP' },
      { value: 'ESTABLISHED,RELATED', desc: 'Combinación habitual para permitir tráfico de retorno.', example: 'sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT' },
    ],
    '-p tcp/udp/icmp': [
      { value: 'tcp', desc: 'Aplica la regla únicamente al tráfico TCP.', example: 'sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT' },
      { value: 'udp', desc: 'Aplica la regla únicamente al tráfico UDP.', example: 'sudo iptables -A INPUT -p udp --dport 53 -j ACCEPT' },
      { value: 'icmp', desc: 'Mensajes ICMP, incluido ping.', example: 'sudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT' },
      { value: 'all', desc: 'Aplica la regla a cualquier protocolo IP.', example: 'sudo iptables -A INPUT -p all -j DROP' },
    ],
  },

  nft: {
    'add table <familia> <nombre>': [
      { value: 'ip', desc: 'Crea la tabla en la familia IPv4.', example: 'sudo nft add table ip filtro' },
      { value: 'ip6', desc: 'Crea la tabla en la familia IPv6.', example: 'sudo nft add table ip6 filtro6' },
      { value: 'inet', desc: 'Tabla unificada IPv4 e IPv6.', example: 'sudo nft add table inet filtro' },
      { value: 'arp', desc: 'Crea la tabla en la familia ARP.', example: 'sudo nft add table arp filtro-arp' },
      { value: 'bridge', desc: 'Crea una tabla para filtrar tráfico que atraviesa bridges.', example: 'sudo nft add table bridge filtro-bridge' },
      { value: 'netdev', desc: 'Filtrado por interfaz de red.', example: 'sudo nft add table netdev filtro-nic' },
    ],
  },

  ufw: {
    'default deny incoming': [
      { value: 'allow', desc: 'Permite por defecto; solo para entornos controlados.', example: 'sudo ufw default allow incoming' },
      { value: 'deny', desc: 'Descarta por defecto; recomendado para entrada.', example: 'sudo ufw default deny incoming' },
      { value: 'reject', desc: 'Rechaza y responde, revelando que el puerto está cerrado.', example: 'sudo ufw default reject incoming' },
    ],
    'allow <puerto>[/tcp|udp]': [
      { value: '22/tcp', desc: 'Permite SSH solo por TCP.', example: 'sudo ufw allow 22/tcp' },
      { value: '80/tcp', desc: 'Permite tráfico HTTP por TCP en el puerto 80.', example: 'sudo ufw allow 80/tcp' },
      { value: '443/tcp', desc: 'Permite tráfico HTTPS por TCP en el puerto 443.', example: 'sudo ufw allow 443/tcp' },
      { value: '53/udp', desc: 'Permite consultas DNS por UDP en el puerto 53.', example: 'sudo ufw allow 53/udp' },
      { value: 'from 10.0.0.0/8 to any port 22', desc: 'Limita SSH a la red interna.', example: 'sudo ufw allow from 10.0.0.0/8 to any port 22 proto tcp' },
    ],
  },

  docker: {
    'run --rm -it <imagen>': [
      { value: '--user 1000:1000', desc: 'Ejecuta sin root dentro del contenedor.', example: 'docker run --rm -it --user 1000:1000 imagen' },
      { value: '--read-only', desc: 'Monta el sistema de archivos como solo lectura.', example: 'docker run --rm -it --read-only -v datos:/data imagen' },
      { value: '--cap-drop=ALL', desc: 'Elimina todas las capabilities del kernel.', example: 'docker run --rm -it --cap-drop=ALL imagen' },
      { value: '--security-opt no-new-privileges', desc: 'Impide escalar privilegios mediante setuid.', example: 'docker run --rm -it --security-opt no-new-privileges imagen' },
      { value: '--network none', desc: 'Aísla el contenedor sin red.', example: 'docker run --rm -it --network none imagen' },
      { value: '--memory 512m', desc: 'Limita el consumo de memoria.', example: 'docker run --rm -it --memory 512m imagen' },
      { value: '-p 127.0.0.1:8080:80', desc: 'Publica un puerto solo en loopback.', example: 'docker run --rm -it -p 127.0.0.1:8080:80 imagen' },
      { value: '-v datos:/data:ro', desc: 'Monta un volumen de solo lectura.', example: 'docker run --rm -it -v datos:/data:ro imagen' },
    ],
  },

  kubectl: {
    'get <recurso>': [
      { value: 'pods', desc: 'Pods en ejecución y su estado.', example: 'kubectl get pods -A' },
      { value: 'svc', desc: 'Servicios y puertos publicados.', example: 'kubectl get svc -A' },
      { value: 'deploy', desc: 'Despliegues, réplicas deseadas y estrategia de actualización.', example: 'kubectl get deploy -A' },
      { value: 'ds', desc: 'DaemonSets, uno por nodo.', example: 'kubectl get ds -A' },
      { value: 'rs', desc: 'ReplicaSets y sus pods asociados.', example: 'kubectl get rs -A' },
      { value: 'cm', desc: 'ConfigMaps, posibles secretos en texto plano.', example: 'kubectl get cm -A' },
      { value: 'secret', desc: 'Secrets, normalmente base64.', example: 'kubectl get secrets -A' },
      { value: 'ing', desc: 'Reglas Ingress que publican servicios HTTP y HTTPS.', example: 'kubectl get ing -A' },
      { value: 'no', desc: 'Nodos del clúster, estados y direcciones internas.', example: 'kubectl get no -o wide' },
      { value: 'pv', desc: 'Volúmenes persistentes disponibles en el clúster.', example: 'kubectl get pv' },
      { value: 'pvc', desc: 'Solicitudes de almacenamiento de los workloads.', example: 'kubectl get pvc -A' },
      { value: 'sa', desc: 'Cuentas de servicio usadas por pods y automatizaciones.', example: 'kubectl get sa -A' },
      { value: 'rbac.authorization.k8s.io', desc: 'Recursos RBAC como roles y bindings.', example: 'kubectl get roles,rolebindings -A' },
      { value: 'events', desc: 'Eventos recientes del clúster.', example: 'kubectl get events -A --sort-by=.lastTimestamp' },
    ],
    'get secrets -o yaml': [
      { value: 'yaml', desc: 'Salida YAML completa; los valores están en base64.', example: 'kubectl get secrets -o yaml' },
      { value: 'json', desc: 'Salida JSON completa para procesar con jq.', example: 'kubectl get secrets -o json | jq .' },
      { value: 'name', desc: 'Solo los nombres de los recursos.', example: 'kubectl get secrets -o name' },
      { value: 'wide', desc: 'Columnas adicionales cuando el recurso lo permite.', example: 'kubectl get secrets -o wide' },
      { value: 'custom-columns=NAME:.metadata.name,TYPE:.type', desc: 'Selecciona columnas concretas.', example: 'kubectl get secrets -o custom-columns=NAME:.metadata.name,TYPE:.type' },
    ],
  },

  terraform: {
    'init': [
      { value: '-upgrade', desc: 'Actualiza providers y módulos a las versiones permitidas.', example: 'terraform init -upgrade' },
      { value: '-backend-config=<archivo>', desc: 'Configura el backend remoto desde un fichero.', example: 'terraform init -backend-config=backend.hcl' },
      { value: '-reconfigure', desc: 'Reconfigura el backend ignorando la configuración previa.', example: 'terraform init -reconfigure' },
    ],
    'plan -out <archivo>': [
      { value: '-var-file=<archivo>', desc: 'Carga variables desde un fichero tfvars.', example: 'terraform plan -var-file=prod.tfvars -out plan.bin' },
      { value: '-target=<recurso>', desc: 'Limita el plan a un recurso concreto.', example: 'terraform plan -target=aws_instance.web -out plan.bin' },
      { value: '-destroy', desc: 'Planifica la destrucción de toda la infraestructura.', example: 'terraform plan -destroy -out destroy.bin' },
      { value: '-refresh=false', desc: 'Evita consultar el estado remoto durante el plan.', example: 'terraform plan -refresh=false -out plan.bin' },
    ],
    'apply <plan>': [
      { value: '-auto-approve', desc: 'Aplica sin confirmación interactiva; úsalo solo en automatización controlada.', example: 'terraform apply -auto-approve plan.bin' },
      { value: '-parallelism=<n>', desc: 'Limita operaciones concurrentes.', example: 'terraform apply -parallelism=1 plan.bin' },
      { value: '-refresh=false', desc: 'No refresca el estado antes de aplicar.', example: 'terraform apply -refresh=false plan.bin' },
    ],
  },

  ansible: {
    '-m <módulo>': [
      { value: 'ping', desc: 'Comprueba conectividad y autenticación sin cambiar nada.', example: 'ansible all -i inventario.ini -m ping' },
      { value: 'command', desc: 'Ejecuta un comando sin shell; no interpreta pipes ni redirecciones.', example: 'ansible all -i inventario.ini -m command -a "uptime"' },
      { value: 'shell', desc: 'Ejecuta un comando mediante shell; permite pipes y variables.', example: 'ansible all -i inventario.ini -m shell -a "df -h | tail -1"' },
      { value: 'copy', desc: 'Copia archivos al host remoto.', example: 'ansible web -i inventario.ini -m copy -a "src=index.html dest=/var/www/html/"' },
      { value: 'file', desc: 'Gestiona permisos, propietarios y estado de archivos.', example: 'ansible web -i inventario.ini -m file -a "path=/var/www mode=0755 state=directory"' },
      { value: 'service', desc: 'Gestiona servicios con init o systemd.', example: 'ansible web -i inventario.ini -m service -a "name=nginx state=restarted"' },
      { value: 'systemd', desc: 'Controla unidades systemd de forma nativa.', example: 'ansible web -i inventario.ini -m systemd -a "name=nginx enabled=true state=started"' },
      { value: 'user', desc: 'Crea o modifica usuarios.', example: 'ansible all -i inventario.ini -m user -a "name=auditor state=present"' },
      { value: 'apt', desc: 'Gestiona paquetes Debian/Ubuntu.', example: 'ansible web -i inventario.ini -m apt -a "name=nginx state=present update_cache=true"' },
      { value: 'dnf', desc: 'Gestiona paquetes Fedora/RHEL.', example: 'ansible web -i inventario.ini -m dnf -a "name=httpd state=present"' },
    ],
  },

  grep: {
    '-E': [
      { value: '-E', desc: 'Expresiones regulares extendidas, con +, ?, | y grupos.', example: 'grep -E "error|failed" app.log' },
      { value: '-F', desc: 'Coincidencia literal, sin interpretar metacaracteres.', example: 'grep -F "a+b" app.log' },
      { value: '-P', desc: 'Expresiones regulares Perl, con lookarounds y \\d.', example: 'grep -P "\\b\\d{1,3}(\\.\\d{1,3}){3}\\b" access.log' },
      { value: '-G', desc: 'Expresiones regulares básicas, el modo por defecto.', example: 'grep -G "^root:" /etc/passwd' },
    ],
  },

  find: {
    '-type f|d|l': [
      { value: 'f', desc: 'Solo archivos regulares, excluyendo directorios y dispositivos.', example: 'find /var/www -type f -name "*.php"' },
      { value: 'd', desc: 'Solo directorios, sin incluir archivos ni enlaces.', example: 'find /var/www -type d -name "backup"' },
      { value: 'l', desc: 'Solo enlaces simbólicos, útil para detectar rutas externas.', example: 'find /etc -type l -ls' },
      { value: 's', desc: 'Solo sockets UNIX, usados por servicios y procesos locales.', example: 'find /run -type s' },
      { value: 'p', desc: 'Solo FIFOs o named pipes, canales de comunicación entre procesos.', example: 'find /run -type p' },
      { value: 'b', desc: 'Solo dispositivos de bloque, como discos y volúmenes.', example: 'find /dev -type b' },
      { value: 'c', desc: 'Dispositivos de carácter.', example: 'find /dev -type c' },
    ],
    '-perm <modo>': [
      { value: '-4000', desc: 'Archivos con SUID activo.', example: 'find / -xdev -perm -4000 -type f 2>/dev/null' },
      { value: '-2000', desc: 'Archivos con SGID activo.', example: 'find / -xdev -perm -2000 -type f 2>/dev/null' },
      { value: '-0002', desc: 'Archivos escribibles por cualquier usuario.', example: 'find / -xdev -perm -0002 -type f 2>/dev/null' },
      { value: 'u+s', desc: 'SUID usando notación simbólica.', example: 'find / -xdev -perm u+s -type f 2>/dev/null' },
      { value: 'g+s', desc: 'SGID usando notación simbólica.', example: 'find / -xdev -perm g+s -type f 2>/dev/null' },
      { value: 'o+w', desc: 'Permiso de escritura para cualquier usuario, un riesgo de integridad.', example: 'find / -xdev -perm o+w -type f 2>/dev/null' },
    ],
    '-mtime <n>': [
      { value: '-1', desc: 'Modificados en las últimas 24 horas.', example: 'find /var/www -type f -mtime -1' },
      { value: '+7', desc: 'Sin modificar desde hace más de siete días.', example: 'find /var/log -type f -mtime +7' },
      { value: '+30', desc: 'Sin modificar desde hace más de un mes.', example: 'find /home -type f -mtime +30' },
      { value: '0', desc: 'Modificados hoy (menos de 24 horas).', example: 'find /etc -type f -mtime 0' },
    ],
    '-size <n>': [
      { value: '+100M', desc: 'Archivos mayores de 100 MB; útil para localizar consumo.', example: 'find /var -type f -size +100M -ls' },
      { value: '+1G', desc: 'Archivos mayores de 1 GB, candidatos a limpieza o revisión.', example: 'find / -xdev -type f -size +1G -ls 2>/dev/null' },
      { value: '-1k', desc: 'Archivos menores de 1 KB, a menudo scripts o configuraciones.', example: 'find /var/www -type f -size -1k' },
      { value: '+10M', desc: 'Archivos mayores de 10 MB; ajusta el umbral según el caso.', example: 'find /home -type f -size +10M' },
      { value: '0', desc: 'Archivos de tamaño cero, posible residuo o error de escritura.', example: 'find /var/log -type f -size 0' },
    ],
    '-exec <cmd> {} \\;': [
      { value: '\\;', desc: 'Ejecuta el comando una vez por cada archivo.', example: 'find . -type f -name "*.bak" -exec rm -i {} \\;' },
      { value: '+', desc: 'Agrupa varios archivos por invocación; más eficiente.', example: 'find . -type f -name "*.log" -exec gzip {} +' },
    ],
  },

  tar: {
    '-c': [
      { value: '-c', desc: 'Crea un archivo tar con los elementos indicados.', example: 'tar -czf backup.tar.gz /srv/datos' },
      { value: '-x', desc: 'Extrae el contenido de un archivo tar existente.', example: 'tar -xzf backup.tar.gz -C /restore' },
      { value: '-t', desc: 'Lista el contenido sin extraer.', example: 'tar -tzf backup.tar.gz | head' },
      { value: '-r', desc: 'Añade archivos a un tar existente sin comprimir.', example: 'tar -rf backup.tar nuevo.txt' },
      { value: '-u', desc: 'Actualiza archivos más recientes dentro del tar.', example: 'tar -uf backup.tar datos/' },
    ],
    '-z / -J / --zstd': [
      { value: '-z', desc: 'Compresión gzip, rápida y compatible.', example: 'tar -czf backup.tar.gz datos/' },
      { value: '-j', desc: 'Compresión bzip2, más lenta y mayor ratio.', example: 'tar -cjf backup.tar.bz2 datos/' },
      { value: '-J', desc: 'Compresión xz, buen ratio pero consume CPU.', example: 'tar -cJf backup.tar.xz datos/' },
      { value: '--zstd', desc: 'Compresión zstd, muy rápida y moderna.', example: 'tar --zstd -cf backup.tar.zst datos/' },
    ],
  },

  tshark: {
    '-T fields -e <campo>': [
      { value: 'ip.src', desc: 'Extrae la dirección IP de origen de cada paquete.', example: 'tshark -r captura.pcap -T fields -e ip.src' },
      { value: 'ip.dst', desc: 'Extrae la dirección IP de destino de cada paquete.', example: 'tshark -r captura.pcap -T fields -e ip.dst' },
      { value: 'tcp.port', desc: 'Puerto TCP de origen o destino.', example: 'tshark -r captura.pcap -T fields -e tcp.port' },
      { value: 'http.host', desc: 'Extrae la cabecera Host de las peticiones HTTP.', example: 'tshark -r captura.pcap -T fields -e http.host' },
      { value: 'http.request.uri', desc: 'Extrae la URI solicitada en cada petición HTTP.', example: 'tshark -r captura.pcap -T fields -e http.request.uri' },
      { value: 'dns.qry.name', desc: 'Nombre consultado en DNS.', example: 'tshark -r captura.pcap -T fields -e dns.qry.name' },
      { value: 'tls.handshake.extensions_server_name', desc: 'Extrae el nombre SNI del handshake TLS.', example: 'tshark -r captura.pcap -T fields -e tls.handshake.extensions_server_name' },
      { value: 'frame.time_epoch', desc: 'Marca temporal con precisión de época.', example: 'tshark -r captura.pcap -T fields -e frame.time_epoch' },
    ],
    '-Y <filtro>': [
      { value: 'http.request', desc: 'Muestra solo peticiones HTTP, sin respuestas.', example: 'tshark -r captura.pcap -Y "http.request"' },
      { value: 'dns', desc: 'Muestra todo el tráfico DNS, consultas y respuestas.', example: 'tshark -r captura.pcap -Y "dns"' },
      { value: 'tcp.port == 443', desc: 'Tráfico TCP en el puerto 443.', example: 'tshark -r captura.pcap -Y "tcp.port == 443"' },
      { value: 'ip.addr == 10.10.10.5', desc: 'Tráfico con esa IP en origen o destino.', example: 'tshark -r captura.pcap -Y "ip.addr == 10.10.10.5"' },
      { value: 'tcp.flags.syn == 1 && tcp.flags.ack == 0', desc: 'Intentos de conexión SYN.', example: 'tshark -r captura.pcap -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0"' },
      { value: 'http.response.code >= 400', desc: 'Respuestas HTTP de error.', example: 'tshark -r captura.pcap -Y "http.response.code >= 400"' },
    ],
    '-T json': [
      { value: 'fields', desc: 'Salida tabular de campos seleccionados.', example: 'tshark -r captura.pcap -T fields -e ip.src -e ip.dst' },
      { value: 'json', desc: 'JSON con todos los árboles de protocolo.', example: 'tshark -r captura.pcap -T json > captura.json' },
      { value: 'jsonraw', desc: 'JSON con valores sin formatear.', example: 'tshark -r captura.pcap -T jsonraw' },
      { value: 'pdml', desc: 'XML de detalles de paquete.', example: 'tshark -r captura.pcap -T pdml > captura.xml' },
      { value: 'ek', desc: 'Formato Elasticsearch Bulk.', example: 'tshark -r captura.pcap -T ek > captura.ndjson' },
      { value: 'psml', desc: 'XML de resumen de paquete.', example: 'tshark -r captura.pcap -T psml' },
    ],
  },

  trivy: {
    '--severity <niveles>': [
      { value: 'CRITICAL', desc: 'Solo vulnerabilidades críticas.', example: 'trivy image --severity CRITICAL nginx:latest' },
      { value: 'HIGH', desc: 'Muestra vulnerabilidades altas y críticas.', example: 'trivy image --severity HIGH,CRITICAL nginx:latest' },
      { value: 'MEDIUM', desc: 'Muestra vulnerabilidades medias, altas y críticas.', example: 'trivy image --severity MEDIUM,HIGH,CRITICAL nginx:latest' },
      { value: 'LOW', desc: 'Muestra vulnerabilidades bajas y de severidad superior.', example: 'trivy image --severity LOW nginx:latest' },
      { value: 'UNKNOWN', desc: 'Muestra hallazgos cuya severidad no está clasificada.', example: 'trivy image --severity UNKNOWN nginx:latest' },
    ],
    '--format <formato>': [
      { value: 'table', desc: 'Tabla legible en terminal.', example: 'trivy image nginx:latest --format table' },
      { value: 'json', desc: 'JSON para automatización.', example: 'trivy image nginx:latest --format json -o trivy.json' },
      { value: 'sarif', desc: 'SARIF para GitHub Code Scanning y otros visores.', example: 'trivy fs . --format sarif -o trivy.sarif' },
      { value: 'template', desc: 'Aplica una plantilla personalizada al informe.', example: 'trivy image nginx:latest --format template --template "@contrib/html.tpl"' },
      { value: 'cyclonedx', desc: 'SBOM en formato CycloneDX.', example: 'trivy image nginx:latest --format cyclonedx -o sbom.json' },
      { value: 'spdx', desc: 'Genera un SBOM en formato SPDX.', example: 'trivy image nginx:latest --format spdx -o sbom.spdx.json' },
    ],
    '--scanners vuln,secret,misconfig': [
      { value: 'vuln', desc: 'Vulnerabilidades en paquetes y dependencias.', example: 'trivy image --scanners vuln nginx:latest' },
      { value: 'secret', desc: 'Secretos embebidos en archivos e imágenes.', example: 'trivy fs --scanners secret .' },
      { value: 'misconfig', desc: 'Malas configuraciones de IaC y contenedores.', example: 'trivy config --scanners misconfig .' },
      { value: 'license', desc: 'Riesgos de licencias de dependencias.', example: 'trivy fs --scanners license .' },
    ],
  },

  nxc: {
    'smb|ldap|winrm|mssql|ssh': [
      { value: 'smb', desc: 'SMB para shares, usuarios, sesiones y políticas.', example: 'nxc smb 10.10.10.5 -u auditor -p "pass" --shares' },
      { value: 'ldap', desc: 'LDAP para consultar Active Directory.', example: 'nxc ldap dc.corp.local -u auditor -p "pass" --users' },
      { value: 'winrm', desc: 'WinRM para validar acceso remoto a Windows.', example: 'nxc winrm 10.10.10.5 -u auditor -p "pass"' },
      { value: 'mssql', desc: 'Prueba credenciales contra Microsoft SQL Server.', example: 'nxc mssql 10.10.10.5 -u sa -p "pass" --local-auth' },
      { value: 'ssh', desc: 'SSH para validar credenciales.', example: 'nxc ssh 10.10.10.5 -u auditor -p "pass"' },
    ],
  },

  netexec: {
    'smb|winrm|ldap|mssql|ssh': [
      { value: 'smb', desc: 'SMB para shares, usuarios, sesiones y políticas.', example: 'netexec smb 10.10.10.5 -u auditor -p "pass" --shares' },
      { value: 'ldap', desc: 'LDAP para consultar Active Directory.', example: 'netexec ldap dc.corp.local -u auditor -p "pass" --users' },
      { value: 'winrm', desc: 'WinRM para validar acceso remoto a Windows.', example: 'netexec winrm 10.10.10.5 -u auditor -p "pass"' },
      { value: 'mssql', desc: 'Prueba credenciales contra Microsoft SQL Server.', example: 'netexec mssql 10.10.10.5 -u sa -p "pass" --local-auth' },
      { value: 'ssh', desc: 'SSH para validar credenciales.', example: 'netexec ssh 10.10.10.5 -u auditor -p "pass"' },
    ],
  },
};
