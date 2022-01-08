import { terminal as terminalObject, Terminal } from './terminal';

export interface Params {
  command: string;
  subCommands: string[];
  flags: Map<string, string | number | boolean>;
}

export interface Context {
  params: Params;
  session: { [key: string]: unknown };
}

export type NextFunctionError = (error?: Error) => void;
export type NextFunctionSuccess = () => void;

export type NextFunction = NextFunctionSuccess | NextFunctionError;

export type UseFunction = (
  context: Context,
  terminal: Terminal,
  nextFunction: NextFunction
) => void;

export interface Program {
  session: { [key: string]: unknown };
  params: Params;
  stack: UseFunction[];

  parseArguments(args: string[]): void;
  lazyStack(promises: Promise<unknown>[]): Generator<unknown, void, unknown>;

  init(): void;

  start(): void;

  use(...fn: UseFunction[]): void;
  use(command: string, ...fn: UseFunction[]): void;
  use(commands: string[], ...fn: UseFunction[]): void;
}

const program = { params: {} } as Program;

program.init = function init() {
  this.session = {};
  this.params = {
    command: '/',
    subCommands: [] as string[],
    flags: new Map<string, string | number | boolean>()
  };
  this.stack = [] as UseFunction[];

  this.parseArguments(process.argv);

  return program;
};

/**
 * TODO: The stack is wrong, need refactor after.ß
 */

program.start = async function start() {
  // eslint-disable-next-line no-restricted-syntax
  for await (const execution of this.stack) {
    execution(
      { session: this.session, params: this.params },
      terminalObject,
      () => console.log('next')
    );
  }
};

program.use = function use(fn, ...fns) {
  if (typeof fn !== 'function') {
    fns.forEach(f => this.stack.push(f));
  } else {
    this.stack.push(fn);
    fns.forEach(f => this.stack.push(f));
  }
};

program.parseArguments = function parseArguments(args: string[]) {
  const hasPendingFlag = args.reduce(
    (accumulator, arg, index) => {
      if (index === 2) {
        this.params.command = arg;
      }
      if (index > 2) {
        if (!arg.startsWith('--') && !arg.startsWith('-')) {
          if (!accumulator.flagPending) {
            this.params.subCommands.push(arg);
          } else {
            this.params.flags.set(accumulator.flagName, arg);
          }
        } else if (accumulator.flagPending) {
          this.params.flags.set(accumulator.flagName, true);
        }

        if (arg.startsWith('--')) {
          const [key, value] = arg.split('=');

          this.params.flags.set(key, value || true);
        } else if (arg.startsWith('-')) {
          return {
            flagPending: true,
            flagName: arg
          };
        }

        return {
          flagPending: false,
          flagName: ''
        };
      }

      return {
        flagPending: false,
        flagName: ''
      };
    },
    {
      flagPending: false,
      flagName: ''
    }
  );

  if (hasPendingFlag.flagPending) {
    this.params.flags.set(hasPendingFlag.flagName, true);
  }
};

export { program };
export default program;
