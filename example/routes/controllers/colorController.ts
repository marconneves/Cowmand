import { Context, Terminal } from '../../../src/cowmand';

const ColorController = async (_: Context, terminal: Terminal) => {
  const answer = await terminal.select(
    'What is the best color?',
    [
      {
        title: 'Blue',
        value: 'blue',
        selected: false
      },
      {
        title: 'Orange',
        value: 'orange',
        selected: false
      },
      {
        title: 'Green',
        value: 'green',
        selected: false
      }
    ],{
      isMultiple: false
    }
  );

  return terminal.end();
};

export { ColorController };
