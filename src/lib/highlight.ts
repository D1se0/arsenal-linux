import type { ScriptLanguage } from '../data/scripting';

export type CodeTokenType =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'builtin'
  | 'variable'
  | 'number'
  | 'operator'
  | 'decorator';

export interface CodeToken {
  type: CodeTokenType;
  value: string;
}

const BASH_KEYWORDS = new Set([
  'if',
  'then',
  'elif',
  'else',
  'fi',
  'for',
  'while',
  'until',
  'do',
  'done',
  'case',
  'esac',
  'in',
  'function',
  'select',
  'time',
  'coproc',
]);

const BASH_BUILTINS = new Set([
  'echo',
  'printf',
  'read',
  'mapfile',
  'readarray',
  'declare',
  'typeset',
  'local',
  'export',
  'readonly',
  'unset',
  'shift',
  'getopts',
  'trap',
  'set',
  'shopt',
  'source',
  'exit',
  'return',
  'break',
  'continue',
  'test',
  'true',
  'false',
  'command',
  'exec',
  'eval',
  'wait',
  'jobs',
  'kill',
  'cd',
  'pwd',
  'type',
  'alias',
  'umask',
  'ulimit',
  'flock',
  'mktemp',
]);

const PYTHON_KEYWORDS = new Set([
  'False',
  'None',
  'True',
  'and',
  'as',
  'assert',
  'async',
  'await',
  'break',
  'class',
  'continue',
  'def',
  'del',
  'elif',
  'else',
  'except',
  'finally',
  'for',
  'from',
  'global',
  'if',
  'import',
  'in',
  'is',
  'lambda',
  'match',
  'case',
  'nonlocal',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'try',
  'while',
  'with',
  'yield',
]);

const PYTHON_BUILTINS = new Set([
  'print',
  'len',
  'range',
  'enumerate',
  'zip',
  'open',
  'input',
  'int',
  'str',
  'float',
  'list',
  'dict',
  'set',
  'tuple',
  'bool',
  'bytes',
  'type',
  'isinstance',
  'issubclass',
  'super',
  'property',
  'staticmethod',
  'classmethod',
  'sorted',
  'sum',
  'min',
  'max',
  'map',
  'filter',
  'any',
  'all',
  'next',
  'iter',
  'getattr',
  'setattr',
  'hasattr',
  'repr',
  'format',
  'Exception',
  'ValueError',
  'TypeError',
  'KeyError',
  'RuntimeError',
  'Path',
]);

const BASH_TOKEN =
  /("(?:\\.|[^"\\])*"|'[^']*'|\$'[^']*'|#.*$|\$\{[^}]*\}|\$[A-Za-z_][A-Za-z0-9_]*|\$[0-9@*#?$!-]|\b(?:if|then|elif|else|fi|for|while|until|do|done|case|esac|in|function|select|time|coproc)\b|\b(?:echo|printf|read|mapfile|readarray|declare|typeset|local|export|readonly|unset|shift|getopts|trap|set|shopt|source|exit|return|break|continue|test|true|false|command|exec|eval|wait|jobs|kill|cd|pwd|type|alias|umask|ulimit|flock|mktemp)\b|\b\d+(?:\.\d+)?\b|&&|\|\||<<|>>|==|!=|<=|>=|[|&;<>()=!])/gm;

const PYTHON_TOKEN =
  /((?:[rfbu]{0,2})?"""[\s\S]*?"""|(?:[rfbu]{0,2})?'''[\s\S]*?'''|(?:[rfbu]{0,2})?"(?:\\.|[^"\\])*"|(?:[rfbu]{0,2})?'(?:\\.|[^'\\])*'|#.*$|@[A-Za-z_][A-Za-z0-9_.]*|\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|match|case|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|\b(?:print|len|range|enumerate|zip|open|input|int|str|float|list|dict|set|tuple|bool|bytes|type|isinstance|issubclass|super|property|staticmethod|classmethod|sorted|sum|min|max|map|filter|any|all|next|iter|getattr|setattr|hasattr|repr|format|Exception|ValueError|TypeError|KeyError|RuntimeError|Path)\b|\b\d+(?:\.\d+)?\b|==|!=|<=|>=|:=|\*\*|\/\/|->|[+\-*/%<>=!&|^~:])/gm;

function classifyBash(value: string): CodeTokenType {
  if (value.startsWith('#')) return 'comment';
  if (/^(?:"|'|\$')/.test(value)) return 'string';
  if (value.startsWith('$')) return 'variable';
  if (BASH_KEYWORDS.has(value)) return 'keyword';
  if (BASH_BUILTINS.has(value)) return 'builtin';
  if (/^\d/.test(value)) return 'number';
  return 'operator';
}

function classifyPython(value: string): CodeTokenType {
  if (value.startsWith('#')) return 'comment';
  if (value.startsWith('@')) return 'decorator';
  if (/^[rfbu]{0,2}(?:"|')/i.test(value)) return 'string';
  if (PYTHON_KEYWORDS.has(value)) return 'keyword';
  if (PYTHON_BUILTINS.has(value)) return 'builtin';
  if (/^\d/.test(value)) return 'number';
  return 'operator';
}

export function tokenizeCode(code: string, language: ScriptLanguage): CodeToken[] {
  const pattern = language === 'bash' ? BASH_TOKEN : PYTHON_TOKEN;
  const classify = language === 'bash' ? classifyBash : classifyPython;
  const tokens: CodeToken[] = [];
  let cursor = 0;
  pattern.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(code)) !== null) {
    if (match.index > cursor) {
      tokens.push({ type: 'plain', value: code.slice(cursor, match.index) });
    }
    tokens.push({ type: classify(match[0]), value: match[0] });
    cursor = match.index + match[0].length;
  }

  if (cursor < code.length) {
    tokens.push({ type: 'plain', value: code.slice(cursor) });
  }

  return tokens;
}

export function dedentCode(code: string): string {
  const normalized = code.replace(/^\n+/, '').replace(/\n+\s*$/, '');
  const lines = normalized.split('\n');
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(indent)).join('\n');
}
