import { Terminal } from '../terminal';

/**
 * Have Command
 * Have Handle Function
 * Have Not in Command List
 * Have math function of command
 * have a next function in handle Function
 */

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
  notImplemented?: true;
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
    notInCommand: string[],
    options: OptionsLayer,
    executor: CommandFunction
  ) {
    this.handle = executor;
    this.name = executor.name;
    this.command = command || '';
    this.notInCommand = notInCommand;

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
        console.log('Match is Root: ', this.name);
        return true;
      }

      isCommand = command.toLowerCase() === this.command.toLowerCase();
    }

    if (!isCommand || isNotInCommand) {
      console.log('Not Match: ', this.name);
      return false;
    }

    console.log('Match: ', this.name);

    return true;
  }
}

export { Layer };
