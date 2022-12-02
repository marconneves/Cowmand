import Debug from 'debug';

import {
  CommandFunction,
  CommandErrorFunction,
  Params
} from './Commands/Layer';
import { IRoute, Router } from './Commands/Router';

const debug = Debug('cowmand:program');

export interface Program {
  session: { [key: string]: unknown };
  params: Params;
  routeBase?: IRoute;

  parseArguments(args: string[]): void;
  lazyStack(promises: Promise<unknown>[]): Generator<unknown, void>;

  init(): void;

  start(callback?: () => void): void;

  use(...fn: (CommandFunction | CommandErrorFunction | IRoute)[]): void;
  use(
    command: string,
    ...fn: (CommandFunction | CommandErrorFunction | IRoute)[]
  ): void;
  use(
    commands: string[],
    ...fn: (CommandFunction | CommandErrorFunction | IRoute)[]
  ): void;
  use(
    command: { notIn: string[] },
    ...fn: (CommandFunction | CommandErrorFunction | IRoute)[]
  ): void;
}

const program = { params: {} } as Program;

program.init = function init() {
  debug('init program');

  this.session = {};
  this.params = {
    command: '/',
    subCommands: [] as string[],
    flags: new Map<string, string | number | boolean>()
  };

  this.parseArguments(process.argv);

  return program;
};

/**
 * TODO: The stack is wrong, need refactor after.ß
 */

program.start = function start(callback) {
  if (callback) callback();

  program.routeBase?.start(this.session, this.params);
};

program.use = function use() {
  if (!this.routeBase) {
    this.routeBase = Router();
    debug('create route base');
  }

  debug('use in route base');
  this.routeBase.use(...arguments);
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
