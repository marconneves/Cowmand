import { Context, Terminal } from '../../../src/cowmand';

const MeController = async (context: Context, terminal: Terminal) => {
  terminal.table([
    {
      name: 'Marcon',
      age: 23,
      from: 'Brazil'
    },
    {
      name: 'Mari',
      age: 21,
      from: 'Italy'
    }
  ]);

  return terminal.log(`Bem vindo ${context.session?.user?.name}`).end();
};

export { MeController };
