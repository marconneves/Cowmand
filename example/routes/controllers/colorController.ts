import { Context, Terminal } from '../../../src/cowmand';

const ColorController = async (_: Context, terminal: Terminal) => {
  terminal.log('OK');

  const answer = await terminal.select('Qual cor voce prefere?', [
    {
      title: '🩵 Azul',
      value: 'blue',
      key: 'r',
      selected: false
    },
    {
      title: '🧡 Laranja',
      value: 'orange',
      key: 'o',
      selected: false
    },
    {
      title: '💚 Verde',
      value: 'green',
      key: 'g',
      selected: false
    }
  ]);

  return terminal.log(`Color ${answer}`).end();
};

export { ColorController };
