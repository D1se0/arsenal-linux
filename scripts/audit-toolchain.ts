import { execFile, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { COMMANDS } from '../src/data/commands';

/**
 * Auditoría segura de herramientas locales.
 * Solo resuelve binarios, consulta man y ejecuta su ayuda. No lanza ejemplos,
 * escaneos, ataques ni comandos que modifiquen el sistema.
 */

const SKIP_HELP: Record<string, string> = {
  linpeas: 'ejecuta enumeración del sistema',
  pspy: 'monitoriza procesos en vivo',
  msfconsole: 'consola interactiva',
  'recon-ng': 'consola interactiva',
  spiderfoot: 'puede iniciar servidor o módulos activos',
  kismet: 'captura Wi-Fi',
  wifite: 'captura y ataque Wi-Fi',
  'airmon-ng': 'modifica interfaces inalámbricas',
  'airodump-ng': 'captura Wi-Fi',
  'aireplay-ng': 'inyecta tráfico Wi-Fi',
  'aircrack-ng': 'ataque Wi-Fi',
  reaver: 'ataque WPS',
  bully: 'ataque WPS',
  hostapd: 'levanta un punto de acceso',
  wpa_supplicant: 'gestiona conexiones inalámbricas',
  responder: 'escucha y responde en red',
  bettercap: 'puede iniciar interfaces y captura',
  eaphammer: 'levanta un AP maligno',
  testdisk: 'interfaz interactiva de recuperación',
  photorec: 'interfaz interactiva de recuperación',
  ghidra: 'puede abrir la GUI',
  nethogs: 'monitoriza tráfico en vivo',
  ettercap: 'captura e inyecta tráfico',
  usbguard: 'requiere privilegios y modifica políticas',
  tmux: 'puede crear una sesión de terminal',
  nslookup: 'no ofrece ayuda no interactiva; usar man',
  'evil-winrm': 'el wrapper instalado no emite ayuda',
};

const HELP_ARGS: Record<string, string[]> = {
  amass: ['-h'],
  aws: ['help'],
  httpx: ['--help'],
  tshark: ['-h'],
  nikto: ['-Help'],
  nc: ['-h'],
  socat: ['-h'],
  xxd: ['-h'],
  radare2: ['-h'],
  ping: ['-h'],
  hping3: ['-h'],
  fping: ['-h'],
  'impacket-GetUserSPNs': ['-h'],
  'impacket-ntlmrelayx': ['-h'],
  'impacket-psexec': ['-h'],
  'impacket-secretsdump': ['-h'],
  'impacket-wmiexec': ['-h'],
  'bloodhound-python': ['-h'],
  'ldapdomaindump': ['-h'],
  'evil-winrm': ['-h'],
  theHarvester: ['-h'],
  wafw00f: ['-h'],
  ffuf: ['-h'],
  dirsearch: ['-h'],
  sqlmap: ['-h'],
  nuclei: ['-h'],
  hydra: ['-h'],
  ncrack: ['-h'],
  crunch: ['-h'],
  hashid: ['-h'],
  exiftool: ['-h'],
  wpscan: ['--help'],
  wfuzz: ['--help'],
  commix: ['--help'],
  wapiti: ['--help'],
};

const HELP_TIMEOUT: Record<string, number> = {
  amass: 20_000,
  aws: 20_000,
};

type HelpOutcome = 'ok' | 'usage' | 'empty' | 'timeout' | 'spawn-error' | 'error' | 'mismatch';

interface AuditResult {
  id: string;
  name: string;
  path: string | null;
  man: boolean;
  help: {
    outcome: HelpOutcome;
    status: number | null;
    args: string[];
    firstLine: string;
  } | null;
  skipped: boolean;
  reason?: string;
}

function resolveBinary(name: string) {
  const result = spawnSync('bash', ['-lc', 'type -P -- "$1"', 'bash', name], {
    encoding: 'utf8',
    timeout: 3_000,
  });
  const path = result.stdout.trim();
  return result.status === 0 && path.startsWith('/') ? path : null;
}

function hasManPage(name: string) {
  const result = spawnSync('man', ['-w', name], {
    encoding: 'utf8',
    timeout: 3_000,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return result.status === 0 && Boolean(result.stdout.trim());
}

function firstLine(stdout: string, stderr: string) {
  return `${stdout}\n${stderr}`
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean) ?? '';
}

async function runHelp(path: string, args: string[], timeout: number) {
  return new Promise<{
    outcome: HelpOutcome;
    status: number | null;
    args: string[];
    firstLine: string;
  }>((resolve) => {
    execFile(
      path,
      args,
      {
        timeout,
        killSignal: 'SIGKILL',
        maxBuffer: 2 * 1024 * 1024,
        env: {
          ...process.env,
          NO_COLOR: '1',
          TERM: 'dumb',
          PAGER: 'cat',
          GIT_PAGER: 'cat',
          SYSTEMD_PAGER: 'cat',
          AWS_PAGER: '',
        },
      },
      (error, stdout, stderr) => {
        const output = `${stdout ?? ''}\n${stderr ?? ''}`.trim();
        const timedOut =
          Boolean(error) &&
          (error?.killed === true ||
            (error as NodeJS.ErrnoException & { signal?: string }).signal === 'SIGKILL');

        const line = firstLine(stdout ?? '', stderr ?? '');
        let outcome: HelpOutcome = output ? 'ok' : 'empty';
        if (timedOut) outcome = 'timeout';
        else if (line.startsWith('Traceback')) outcome = 'error';
        else if (error && !output) outcome = 'spawn-error';
        else if (error) outcome = 'usage';

        resolve({
          outcome,
          status: typeof error?.code === 'number' ? error.code : error ? null : 0,
          args,
          firstLine: line,
        });
      },
    );
  });
}

async function pool<T, R>(items: T[], limit: number, worker: (item: T, index: number) => Promise<R>) {
  const results = new Array<R>(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (true) {
        const index = cursor;
        cursor += 1;
        if (index >= items.length) return;
        results[index] = await worker(items[index], index);
      }
    }),
  );
  return results;
}

const resolved = COMMANDS.map((command) => ({
  command,
  path: resolveBinary(command.name),
  man: false,
}));

const results = await pool(resolved, 4, async ({ command, path }): Promise<AuditResult> => {
  if (!path) {
    return {
      id: command.id,
      name: command.name,
      path: null,
      man: false,
      help: null,
      skipped: false,
      reason: 'no instalado',
    };
  }

  const man = hasManPage(command.name);
  const skipReason = SKIP_HELP[command.name];
  if (skipReason) {
    return {
      id: command.id,
      name: command.name,
      path,
      man,
      help: null,
      skipped: true,
      reason: skipReason,
    };
  }

  const args = HELP_ARGS[command.name] ?? ['--help'];
  const help = await runHelp(path, args, HELP_TIMEOUT[command.name] ?? 5_000);
  if (command.name === 'httpx' && help.firstLine.includes('HTTPX')) {
    help.outcome = 'mismatch';
  }
  return {
    id: command.id,
    name: command.name,
    path,
    man,
    help,
    skipped: false,
  };
});

const installed = results.filter((result) => result.path);
const missing = results.filter((result) => !result.path);
const skipped = results.filter((result) => result.skipped);
const helped = results.filter((result) => result.help);
const counts = helped.reduce<Record<string, number>>((accumulator, result) => {
  const outcome = result.help?.outcome ?? 'empty';
  accumulator[outcome] = (accumulator[outcome] ?? 0) + 1;
  return accumulator;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  total: COMMANDS.length,
  installed: installed.length,
  missing: missing.length,
  manPages: installed.filter((result) => result.man).length,
  skipped: skipped.length,
  outcomes: counts,
  results,
};

mkdirSync('audit', { recursive: true });
writeFileSync('audit/toolchain-audit.json', `${JSON.stringify(report, null, 2)}\n`);

console.log('Arsenal Linux · auditoría de herramientas locales');
console.log('------------------------------------------------');
console.log(`Comandos documentados:     ${report.total}`);
console.log(`Binarios encontrados:      ${report.installed}`);
console.log(`No instalados:             ${report.missing}`);
console.log(`Man disponible:            ${report.manPages}`);
console.log(`Ayuda ejecutada:           ${helped.length}`);
console.log(`  · salida correcta:       ${counts.ok ?? 0}`);
console.log(`  · uso / exit distinto:   ${counts.usage ?? 0}`);
console.log(`  · sin salida:            ${counts.empty ?? 0}`);
console.log(`  · timeout:               ${counts.timeout ?? 0}`);
console.log(`  · error de ejecución:    ${counts['spawn-error'] ?? 0}`);
console.log(`  · binario distinto:      ${counts.mismatch ?? 0}`);
console.log(`  · error del binario:     ${counts.error ?? 0}`);
console.log(`Omitidos por seguridad:    ${skipped.length}`);
console.log('');
console.log('Revisar:');
console.log(
  results
    .filter((result) => result.help?.outcome === 'error' || result.help?.outcome === 'mismatch')
    .map((result) => `  · ${result.name}: ${result.help?.outcome} — ${result.help?.firstLine}`)
    .join('\n') || '  · ninguno',
);
console.log('');
console.log('Omitidos:');
console.log(skipped.map((result) => `  · ${result.name}: ${result.reason}`).join('\n') || '  · ninguno');
console.log('');
console.log('No instalados:');
console.log(missing.map((result) => result.name).join(', ') || '  · ninguno');
console.log('');
console.log('Informe completo: audit/toolchain-audit.json');
console.log('No se ha ejecutado ningún ejemplo ni comando ofensivo.');
