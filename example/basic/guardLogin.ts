import jsonFile from 'jsonfile';
import path from 'path';
import { Context, Terminal, NextFunction } from '../../src/cowmand';

const GuardLogin = async (
  context: Context,
  terminal: Terminal,
  next: NextFunction
) => {
  let session;

  try {
    session = jsonFile.readFileSync(path.resolve(__dirname, 'session.json'), {
      throws: false
    });
  } catch (error) {
    console.log(error, 'other');
  }

  context.session.user = session?.user;

  if (session?.user || context.params.command === 'login') {
    terminal.table([
      { user: 'Bruna', status: 'open' },
      { user: 'Lucas', status: 'open' }
    ]);

    return next();
  }

  return terminal
    .error('Error:', [
      'User not is logged.',
      `Execute: script login --user=admin --password=admin`
    ])
    .end();
};

export { GuardLogin };
