import { terminal as terminalObject } from './terminal';
import { Layer, CommandFunction, Params } from './Commands/Layer';

export interface Program {
  session: { [key: string]: unknown };
  params: Params;
  stack: Layer[];

  parseArguments(args: string[]): void;
  lazyStack(promises: Promise<unknown>[]): Generator<unknown, void>;

  init(): void;

  start(): void;

  use(...fn: CommandFunction[]): void;
  use(command: string, ...fn: CommandFunction[]): void;
  use(notInCommands: string[], ...fn: CommandFunction[]): void;
  use(command: string, notInCommands: string[], ...fn: CommandFunction[]): void;
}

const program = { params: {} } as Program;

program.init = function init() {
  this.session = {};
  this.params = {
    command: '/',
    subCommands: [] as string[],
    flags: new Map<string, string | number | boolean>()
  };
  this.stack = [] as Layer[];

  this.parseArguments(process.argv);

  return program;
};

/**
 * TODO: The stack is wrong, need refactor after.ß
 */

program.start = async function start() {
  // eslint-disable-next-line no-restricted-syntax
  for await (const execution of this.stack) {
    if (!execution.match(this.params.command)) {
      continue;
    }
    execution.handle(
      { session: this.session, params: this.params },
      terminalObject,
      () => console.log('next')
    );
  }
};

program.use = function use(firstArgument, secondArgument) {
  let offset = 0;
  let command = '';
  let notInCommands = [];

  if (typeof firstArgument === 'string' && typeof secondArgument === 'object') {
    command = firstArgument;
    notInCommands = secondArgument;
    offset = 2;
  } else if (typeof firstArgument === 'string') {
    command = firstArgument;
    offset = 1;
  } else if (typeof firstArgument === 'object') {
    notInCommands = firstArgument;
    offset = 1;
  }

  const callbacks = (
    Object.values(arguments) as unknown as CommandFunction[]
  ).slice(offset);

  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i];
    this.stack.push(new Layer(command, notInCommands, {}, callback));
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
