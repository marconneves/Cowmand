import { Context, Terminal, NextFunction } from '../../src/cowmand';

const GuardLogin = async (
  context: Context,
  terminal: Terminal,
  next: NextFunction
) => {
  if (context.session.user || context.params.command === 'login') {
    terminal.table([
      { user: 'Bruna', status: 'open' },
      { user: 'Lucas', status: 'open' }
    ]);

    return next();
  }

  return terminal.error('Error:', ['User not is logged.']).end();
};

export { GuardLogin };
