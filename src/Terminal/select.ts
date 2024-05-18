import { createInterface, moveCursor, clearScreenDown } from 'readline';
import { stdin, stdout } from 'process';
import { Writable } from 'stream';

export interface OptionsSelect {
  title: string;
  value: string;
  key?: string;
  selected?: boolean;
}

enum KeysEnum {
  CTRL_C = '\u0003',
  UP_ARROW = '\u001B\u005B\u0041',
  DOWN_ARROW = '\u001B\u005B\u0042',
  SPACE = ' ',
  ENTER = '\r',
  X = 'X'
}

const select = async function select(
  question: string,
  options: OptionsSelect[]
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

    const renderOptions = () => {
      console.log(question);
      options.forEach((option, index) => {
        const isSelected = option.selected ? 'x' : ' ';
        const isCurrent = index === selectedIndex ? '>' : ' ';
        console.log(`${isCurrent} [${isSelected}] ${option.title}`);
      });
    };

    renderOptions();

    const cleanTerminal = () => {
      moveCursor(stdout, 0, -options.length - 1);
      clearScreenDown(stdout);
    };

    const reRenderOptions = () => {
      cleanTerminal();
      renderOptions();
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const handleKeyPress = key => {
      if (key === KeysEnum.CTRL_C) {
        resolve([]);
      } else if (key === KeysEnum.UP_ARROW) {
        if (selectedIndex > 0) {
          selectedIndex--;
          reRenderOptions();
        }
      } else if (key === KeysEnum.DOWN_ARROW) {
        if (selectedIndex < options.length - 1) {
          selectedIndex++;
          reRenderOptions();
        }
      } else if (key === KeysEnum.SPACE || key === KeysEnum.X) {
        options[selectedIndex].selected = !options[selectedIndex].selected;
        reRenderOptions();
      } else if (key === KeysEnum.ENTER) {
        readline.close();
        stdin.setRawMode(false);
        resolve(
          options.filter(option => option.selected).map(option => option.value)
        );
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

export { select };
