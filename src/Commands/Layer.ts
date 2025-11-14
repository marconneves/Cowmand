import Debug from 'debug';
import { Terminal } from '../Terminal/index.js';
import { IRoute } from './Router.js';

const debug = Debug('cowmand:layer');
const debugMatch = Debug('cowmand:layer:match');

export interface Params {
  command?: string;
  subCommands: string[];
  flags: Map<string, string | number | boolean>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Context<T = any> {
  params: Params;
  session: { [key: string]: T };
}

export type NextFunctionError = (error?: Error) => void;
export type NextFunctionSuccess = () => void;

export type NextFunction = NextFunctionSuccess | NextFunctionError;

export type CommandFunction = (
  context: Context,
  terminal: Terminal,
  nextFunction: NextFunction
) => void | Promise<void>;

export type CommandErrorFunction = (
  context: Context,
  terminal: Terminal,
  nextFunction: NextFunctionError,
  error: Error
) => void;

export interface OptionsLayer {
  subCommands: string[];
  notInCommands: string[];
  isRouter?: boolean;
}

export interface ILayer {
  match(command: string): boolean;
}

/**
 * To Create Layer
 * @param handle (function)
 * @param next (function)
 * @param notInCommandList (boolean)
 * @param command (function)
` */

class Layer implements ILayer {
  private readonly name: string;

  public handle?: CommandFunction;

  public handleError?: CommandErrorFunction;

  public command: string;

  public notInCommand: string[];

  public baseMathSetting: { isRoot: boolean };

  public isRouter: boolean;

  public route?: IRoute;

  constructor(
    command: string | undefined,
    options: OptionsLayer,
    executor: CommandFunction | CommandErrorFunction,
    route?: IRoute
  ) {
    if (executor.length <= 3) {
      this.handle = executor as unknown as CommandFunction;
    }
    if (executor.length > 3) {
      this.handleError = executor as unknown as CommandErrorFunction;
    }
    if (route) {
      this.route = route;
    }

    this.name = executor.name || 'anonymous';
    this.command = command || '/';
    this.notInCommand = options.notInCommands || [];
    this.isRouter = options.isRouter || false;

    debug('new %s:%s', this.name, command);

    this.baseMathSetting = { isRoot: command === '/' };
  }

  match(command: string): boolean {
    let isCommand;
    let isNotInCommand;

    if (command != null) {
      isNotInCommand = this.notInCommand.some(
        notInCommand => notInCommand.toLowerCase() === command.toLowerCase()
      );

      if (this.baseMathSetting.isRoot && !isNotInCommand) {
        debugMatch('match is root: %s', this.name);
        return true;
      }

      isCommand = command.toLowerCase() === this.command.toLowerCase();
    }

    if (!isCommand || isNotInCommand) {
      debugMatch('not match: %s', this.name);
      return false;
    }

    debugMatch('match: %s', this.name);
    return true;
  }
}

export { Layer };
