import jsonFile from 'jsonfile';
import path from 'path';

import { Context, Terminal } from '../../src/cowmand';

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const LoginController = async (context: Context, terminal: Terminal) => {
  let user = context.params.flags.get('--user');
  if(!user){
    user = await terminal.ask("Username: ")
  }

  let password = context.params.flags.get('--password');
  if(!password){
    password = await terminal.ask("Password: ", {hidden: true})
  }

  const loading = terminal.loading('Logging in...');
  await delay(3000);

  if (user !== 'admin' || password !== 'admin') {
    loading.fail('Error in crate a login. Password or user is incorrect.');
    return terminal.end();
  }

  jsonFile.writeFileSync(path.resolve(__dirname, 'session.json'), {
    user: { name: 'Marcon Willian' }
  });

  loading.succeed('Logged in!');

  return terminal.log('Login successful').end();
};

export { LoginController };
