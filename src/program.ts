import { terminal as terminalObject, Terminal } from './terminal';

export interface Params {
  command: string;
  subCommands: string[];
  flags: [string, string | number | boolean][];
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

interface Program {
  session: { [key: string]: unknown };
  params: Params;
  stack: UseFunction[];

  parseArguments(args: string[]): void;

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
    flags: [] as [string, string | number | boolean][]
  };
  this.stack = [] as UseFunction[];

  this.parseArguments(process.argv);

  return program;
};

program.start = function start() {
  // Start the program
  this.stack.forEach(execution =>
    execution(
      { session: this.session, params: this.params },
      terminalObject,
      () => console.log('next')
    )
  );
};

program.use = function use(fn, fns) {
  if (typeof fn !== 'function') {
    console.log(fns);
    this.stack.push(fns);
  } else {
    this.stack.push(fn);
    this.stack.push(fns);
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
            this.params.flags.push([accumulator.flagName, arg]);
          }
        } else if (accumulator.flagPending) {
          this.params.flags.push([accumulator.flagName, true]);
        } else if (arg.startsWith('--')) {
          const [key, value] = arg.split('=');

          this.params.flags.push([key, value || true]);
        } else if (arg.startsWith('-')) {
          const [key] = arg.split('=');

          return {
            flagPending: true,
            flagName: key
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
    this.params.flags.push([hasPendingFlag.flagName, true]);
  }
};

export { program };
export default program;
