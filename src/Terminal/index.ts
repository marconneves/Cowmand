import chalk from 'chalk';
import ora from 'ora';
import { ask, OptionsAsk } from './ask';

interface Terminal {
  log(...args: unknown[]): Terminal;
  error(title: string, lines: string[]): Terminal;
  table(...args: unknown[]): Terminal;

  ask(question: string, optionsAsk?: OptionsAsk): Promise<string>;

  loading(text: string): {
    changeText(textChange: string): void;
    stop(): void;
    changeColor(color: ora.Color): void;
    succeed(textSuccess: string): void;
    fail(textFail: string): void;
  };

  end(): void;
}

const terminal: Terminal = {
  log(...args: unknown[]) {
    console.log(...args);
    return this;
  },
  error(title: string, lines: string[]) {
    const space = ' '.repeat(title.length);

    console.log(chalk.red.bold(title), chalk.red(lines.join(`\n ${space}`)));
    return this;
  },
  table(...args: unknown[]) {
    console.table(...args);
    return this;
  },
  ask,
  loading(text: string) {
    const spinner = ora({
      text: `${text}`
    }).start();

    return {
      changeColor(color: ora.Color) {
        spinner.color = color;
      },
      changeText(textChange: string) {
        spinner.text = textChange;
      },
      stop() {
        spinner.stop();
      },
      succeed(textSuccess: string) {
        spinner.succeed(textSuccess);
      },
      fail(textFail: string) {
        spinner.fail(textFail);
      }
    };
  },
  end(status = 0) {
    process.exit(status);
  }
};

export { terminal, Terminal };
