import ora from 'ora';
import { OptionsAsk } from '../Terminal/ask';

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

export { Terminal };
