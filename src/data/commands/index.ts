import type { CategoryId, Command, Role, Tactic } from '../types';
import { CATEGORIES, CATEGORY_BY_ID } from '../categories';
import { reconCommands } from './recon';
import { scanningCommands } from './scanning';
import { webCommands } from './web';
import { exploitCommands } from './exploit';
import { passwordCommands } from './passwords';
import { networkCommands } from './network';
import { sysadminCommands } from './sysadmin';
import { shellCommands } from './shell';
import { forensicsCommands } from './forensics';
import { hardeningCommands } from './hardening';
import { malwareCommands } from './malware';
import { wirelessCommands } from './wireless';
import { cloudCommands } from './cloud';
import { extraReconCommands } from './extra-recon';
import { extraScanningCommands } from './extra-scanning';
import { extraWebCommands } from './extra-web';
import { extraExploitCommands } from './extra-exploit';
import { extraPasswordCommands } from './extra-passwords';
import { extraNetworkCommands } from './extra-network';
import { extraSysadminCommands } from './extra-sysadmin';
import { extraShellCommands } from './extra-shell';
import { extraForensicsCommands } from './extra-forensics';
import { extraHardeningCommands } from './extra-hardening';
import { extraMalwareCommands } from './extra-malware';
import { extraWirelessCommands } from './extra-wireless';
import { extraCloudCommands } from './extra-cloud';
import { extra2ToolsCommands } from './extra2-tools';
import { extra3ToolsCommands } from './extra3-tools';
import { extra4ToolsCommands } from './extra4-tools';
import { EXTRA_EXAMPLES } from './extra-examples';
import { PARAM_OPTIONS } from './param-options';
import { MORE_PARAM_OPTIONS } from './param-options-more';

const ALL_PARAM_OPTIONS = { ...PARAM_OPTIONS, ...MORE_PARAM_OPTIONS };

function enrichCommand(command: Command): Command {
  const options = ALL_PARAM_OPTIONS[command.id];
  const extraExamples = EXTRA_EXAMPLES[command.id];
  if (!options && !extraExamples) return command;
  return {
    ...command,
    params: command.params.map((param) =>
      param.options?.length || !options?.[param.flag]
        ? param
        : { ...param, options: options[param.flag] },
    ),
    examples: [...command.examples, ...(extraExamples ?? [])],
  };
}

export const COMMANDS: Command[] = [
  ...reconCommands,
  ...scanningCommands,
  ...webCommands,
  ...exploitCommands,
  ...passwordCommands,
  ...networkCommands,
  ...sysadminCommands,
  ...shellCommands,
  ...forensicsCommands,
  ...hardeningCommands,
  ...malwareCommands,
  ...wirelessCommands,
  ...cloudCommands,
  ...extraReconCommands,
  ...extraScanningCommands,
  ...extraWebCommands,
  ...extraExploitCommands,
  ...extraPasswordCommands,
  ...extraNetworkCommands,
  ...extraSysadminCommands,
  ...extraShellCommands,
  ...extraForensicsCommands,
  ...extraHardeningCommands,
  ...extraMalwareCommands,
  ...extraWirelessCommands,
  ...extraCloudCommands,
  ...extra2ToolsCommands,
  ...extra3ToolsCommands,
  ...extra4ToolsCommands,
]
  .map(enrichCommand)
  .sort((a, b) => a.name.localeCompare(b.name, 'es'));

export const COMMAND_BY_ID = new Map(COMMANDS.map((command) => [command.id, command]));

/** Related command IDs cleaned to those that actually exist in the database. */
export const RELATED_BY_COMMAND = new Map(
  COMMANDS.map((command) => [
    command.id,
    (command.related ?? []).filter((id) => COMMAND_BY_ID.has(id)),
  ]),
);

export const CATEGORY_COUNTS = Object.fromEntries(
  CATEGORIES.map((category) => [
    category.id,
    COMMANDS.filter((command) => command.category === category.id).length,
  ]),
) as Record<CategoryId, number>;

export const ROLE_COUNTS = Object.fromEntries(
  (['red', 'blue', 'admin', 'network'] as Role[]).map((role) => [
    role,
    COMMANDS.filter((command) => command.roles.includes(role)).length,
  ]),
) as Record<Role, number>;

export const TACTIC_COUNTS = COMMANDS.reduce<Partial<Record<Tactic, number>>>((acc, command) => {
  command.tactics?.forEach((tactic) => {
    acc[tactic] = (acc[tactic] ?? 0) + 1;
  });
  return acc;
}, {});

const subparameters = COMMANDS.reduce(
  (total, command) =>
    total + command.params.reduce((sum, param) => sum + (param.options?.length ?? 0), 0),
  0,
);

const parameters = COMMANDS.reduce((total, command) => total + command.params.length, 0);

export const COMMAND_STATS = {
  commands: COMMANDS.length,
  categories: CATEGORIES.length,
  examples: COMMANDS.reduce((total, command) => total + command.examples.length, 0),
  parameters,
  subparameters,
  documentedOptions: parameters + subparameters,
  tactics: Object.keys(TACTIC_COUNTS).length,
  red: ROLE_COUNTS.red,
  blue: ROLE_COUNTS.blue,
};

export function getCategory(command: Command) {
  return CATEGORY_BY_ID[command.category];
}
