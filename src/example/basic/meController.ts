import { Context, Terminal } from '../../cowmand';

const MeController = async (context: Context, terminal: Terminal) => {
  return terminal.log(`Bem vindo ${context.session?.user?.name}`).end();
};

export { MeController };
