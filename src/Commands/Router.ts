import Debug from 'debug';
import { CommandErrorFunction, CommandFunction, Layer, Params } from './Layer';
import { terminal as terminalObject } from '../Terminal';

const debug = Debug('cowmand:Router');

export interface IRoute {
  stack: Layer[];
  name: string;
  session: { [key: string]: unknown };
  params: Params;

  start(session: { [key: string]: unknown }, params: Params): void;

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

const proto = {} as IRoute;

proto.use = function use(firstArgument) {
  let offset = 0;
  let command = '/';
  let subCommands = [] as string[];
  let notInCommands = [] as string[];

  if (typeof firstArgument !== 'function' && firstArgument?.name !== 'router') {
    offset = 1;

    if (typeof firstArgument === 'string') {
      command = firstArgument;
    } else if (Array.isArray(firstArgument)) {
      const [commands, ...rest] = firstArgument as string[];

      command = commands;
      subCommands = rest;
    } else {
      notInCommands = firstArgument.notIn;
    }
  }

  const callbacks = (
    Object.values(arguments) as unknown as (
      | CommandFunction
      | CommandErrorFunction
      | IRoute
    )[]
  ).slice(offset);

  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i];

    debug("use middleware %s on '%s'", callback.name, command);

    if (callback.name === 'router') {
      this.stack.push(
        new Layer(
          command,
          {
            subCommands,
            notInCommands,
            isRouter: callback.name === 'router'
          },
          () => undefined,
          callback as IRoute
        )
      );
    } else {
      this.stack.push(
        new Layer(
          command,
          {
            subCommands,
            notInCommands
          },
          callback as CommandFunction | CommandErrorFunction
        )
      );
    }
  }
};

proto.start = function start(
  session: { [key: string]: unknown },
  params: Params
) {
  let index = 0;

  this.session = session;
  this.params = params;

  const next = (error?: Error) => {
    if (error) console.log(error);

    if (index >= this.stack.length) return;

    let layerStack;
    let match;

    while (match !== true && index < this.stack.length) {
      layerStack = this.stack[index];
      match = layerStack.match(this.params.command);

      index++;

      if (!match) {
        continue;
      }

      if (error && !layerStack.handleError) {
        continue;
      }

      if (layerStack.isRouter) {
        const sliceStartOn =
          layerStack.command && layerStack.command === '/' ? 0 : 1;
        const internalParams = {
          command:
            layerStack.command === '/' ? params.command : params.subCommands[0],
          subCommands: params.subCommands.slice(sliceStartOn),
          flags: params.flags
        } as Params;

        layerStack.route.start(this.session, internalParams);
      }

      if (error && layerStack.handleError) {
        layerStack.handleError(
          { session: this.session, params: this.params },
          terminalObject,
          next,
          error
        );
      }

      layerStack.handle(
        { session: this.session, params: this.params },
        terminalObject,
        next
      );

      return;
    }
  };

  next();
};

function Router() {
  const route = {
    ...proto,
    name: 'router',
    stack: [] as Layer[]
  };

  return route;
}

export { Router };
