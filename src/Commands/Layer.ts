import Debug from 'debug';
import { Terminal } from '../terminal';

const debug = Debug('cowmand:layer');
const debugMatch = Debug('cowmand:layer:match');

export interface Params {
  command: string;
  subCommands: string[];
  flags: Map<string, string | number | boolean>;
}

export interface Context {
  params: Params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: { [key: string]: any };
}

export type NextFunctionError = (error?: Error) => void;
export type NextFunctionSuccess = () => void;

export type NextFunction = NextFunctionSuccess | NextFunctionError;

export type CommandFunction = (
  context: Context,
  terminal: Terminal,
  nextFunction: NextFunction
) => void;

export type CommandErrorFunction = (
  error: Error,
  context: Context,
  terminal: Terminal,
  nextFunction: NextFunction
) => void;

export interface OptionsLayer {
  subCommands: string[];
  notInCommands: string[];
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

  public handle: CommandFunction;

  private command: string;

  private notInCommand: string[];

  private baseMathSetting: { isRoot: boolean };

  constructor(
    command: string | undefined,
    options: OptionsLayer,
    executor: CommandFunction
  ) {
    this.handle = executor;

    this.name = executor.name || 'anonymous';
    this.command = command || '';
    this.notInCommand = options.notInCommands || [];

    debug('new %s:%s', this.name, command);

    this.baseMathSetting = { isRoot: command === '' };
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
