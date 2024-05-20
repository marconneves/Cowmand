import { createInterface, moveCursor, clearScreenDown } from 'readline';
import { stdin, stdout } from 'process';
import { Writable } from 'stream';
import chalk from 'chalk';

export interface OptionsSelect {
  isMultiple: boolean;
}

export interface ItemMultipleSelect {
  title: string;
  value: string;
  selected?: boolean;
}

export interface ItemSingleSelect {
  title: string;
  value: string;
}

export type ItemSelect = ItemMultipleSelect | ItemSingleSelect;

export enum KeysEnum {
  CTRL_C = '\u0003',
  UP_ARROW = '\u001B\u005B\u0041',
  DOWN_ARROW = '\u001B\u005B\u0042',
  SPACE = ' ',
  ENTER = '\r',
  X = 'x'
}

const cleanTerminal = (columnBack: number, linedBack: number) => {
  moveCursor(stdout, columnBack, -linedBack);
  clearScreenDown(stdout);
};

const selectMultiple = async function selectMultiple(
  question: string,
  items: ItemMultipleSelect[]
): Promise<string[]> {
  return new Promise(resolve => {
    const output = new Writable({
      write(chunk: Buffer, encoding, callback) {
        callback();
      }
    });

    const readline = createInterface({
      input: stdin,
      output,
      terminal: true
    });

    let selectedIndex = 0;

    const renderItems = () => {
      console.log(question);
      items.forEach((item, index) => {
        const isSelected = item.selected ? 'x' : ' ';
        const isCurrent = index === selectedIndex ? '>' : ' ';
        console.log(`${isCurrent} [${isSelected}] ${item.title}`);
      });
    };

    renderItems();

    const reRenderItems = () => {
      cleanTerminal(0, items.length + 1);
      renderItems();
    };

    const renderAwesome = (item: string) => {
      cleanTerminal(0, items.length + 1);
      console.log(question, chalk.cyanBright(item));
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const handleKeyPress = (key: string) => {
      if (key === KeysEnum.CTRL_C) {
        resolve([]);
      } else if (key === KeysEnum.UP_ARROW) {
        if (selectedIndex > 0) {
          selectedIndex--;
          reRenderItems();
        }
      } else if (key === KeysEnum.DOWN_ARROW) {
        if (selectedIndex < items.length - 1) {
          selectedIndex++;
          reRenderItems();
        }
      } else if (key === KeysEnum.SPACE || key.toLowerCase() === KeysEnum.X) {
        items[selectedIndex].selected = !items[selectedIndex].selected;
        reRenderItems();
      } else if (key === KeysEnum.ENTER) {
        readline.close();
        stdin.setRawMode(false);
        const selected = items.filter(option => option.selected);

        renderAwesome(selected.map(option => option.title).join(', '));
        resolve(selected.map(option => option.value));
      }
    };

    stdin.on('data', handleKeyPress);

    readline.on('close', () => {
      stdin.removeListener('data', handleKeyPress);
      stdin.setRawMode(false);
      stdin.pause();
    });
  });
};

const selectSingle = async function selectSingle(
  question: string,
  items: ItemSingleSelect[]
): Promise<string> {
  return new Promise(resolve => {
    const output = new Writable({
      write(chunk: Buffer, encoding, callback) {
        callback();
      }
    });

    const readline = createInterface({
      input: stdin,
      output,
      terminal: true
    });

    let selectedIndex = 0;

    const renderItems = () => {
      console.log(question);
      items.forEach((option, index) => {
        const isCurrent = index === selectedIndex;

        if (isCurrent) {
          console.log(`>`, chalk.cyanBright(option.title));
        } else {
          console.log(`  ${option.title}`);
        }
      });
    };

    renderItems();

    const reRenderItems = () => {
      cleanTerminal(0, items.length + 1);
      renderItems();
    };

    const renderAwesome = (item: string) => {
      cleanTerminal(0, items.length + 1);
      console.log(question, chalk.cyanBright(item));
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const handleKeyPress = (key: string) => {
      if (key === KeysEnum.CTRL_C) {
        resolve('');
      } else if (key === KeysEnum.UP_ARROW) {
        if (selectedIndex > 0) {
          selectedIndex--;
          reRenderItems();
        }
      } else if (key === KeysEnum.DOWN_ARROW) {
        if (selectedIndex < items.length - 1) {
          selectedIndex++;
          reRenderItems();
        }
      } else if (
        [KeysEnum.SPACE, KeysEnum.ENTER].includes(key as KeysEnum) ||
        key.toLowerCase() === KeysEnum.X
      ) {
        readline.close();
        stdin.setRawMode(false);
        const selected = items[selectedIndex];

        renderAwesome(selected.title);
        resolve(selected.value);
      }
    };

    stdin.on('data', handleKeyPress);

    readline.on('close', () => {
      stdin.removeListener('data', handleKeyPress);
      stdin.setRawMode(false);
      stdin.pause();
    });
  });
};

const select = async function select(
  question: string,
  items: ItemSelect[],
  options?: OptionsSelect
): Promise<string[] | string> {
  if (options?.isMultiple) {
    return selectMultiple(question, items as ItemMultipleSelect[]);
  }

  return selectSingle(question, items as ItemSingleSelect[]);
};

export { select };
