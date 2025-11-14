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
      if (index <= 1) {
        // Skip node and script name
        return accumulator;
      }
      if (index === 2) {
        this.params.command = arg;
        return accumulator;
      }

      // At this point, index > 2
      if (accumulator.flagPending) {
        if (arg.startsWith('-')) {
          // Previous flag was boolean, this is a new flag
          this.params.flags.set(accumulator.flagName, true);
          // Fall through to process the new flag
        } else {
          // This is the value for the previous flag
          this.params.flags.set(accumulator.flagName, arg);
          return { flagPending: false, flagName: '' };
        }
      }

      if (arg.startsWith('--')) {
        const [key, value] = arg.split('=');
        if (value !== undefined) {
          this.params.flags.set(key, value);
          return { flagPending: false, flagName: '' };
        }
        // It's a flag like --foo, might have a value next
        return { flagPending: true, flagName: key };
      }

      if (arg.startsWith('-')) {
        // It's a flag like -f, might have a value next
        return { flagPending: true, flagName: arg };
      }

      // It's a subcommand
      this.params.subCommands.push(arg);
      return { flagPending: false, flagName: '' };
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
