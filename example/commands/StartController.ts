import { Context, Terminal } from '../../src/cowmand';

const StartController = async (context: Context, terminal: Terminal) => {
  let { applicationName, port } = context.arguments;

  console.log(applicationName, port)

  return terminal.log('Application Starter').end();
};

export { StartController };
