import jsonFile from 'jsonfile';
import path from 'path';
import { Context, Terminal, NextFunction } from '../../cowmand';

const GuardLogin = async (
  context: Context,
  terminal: Terminal,
  next: NextFunction
) => {
  const session = jsonFile.readFileSync(
    path.resolve(__dirname, 'session.json'),
    {
      throws: false
    }
  );

  if (session?.user || context.params.command === 'login') {
    terminal.table([
      { user: 'Bruna', status: 'open' },
      { user: 'Lucas', status: 'open' }
    ]);

    return next();
  }

  return terminal.error('Error:', ['User not is logged.']).end();
};

export { GuardLogin };
