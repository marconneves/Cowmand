import { createInterface } from 'readline';
import { Writable } from 'stream';

export interface OptionsAsk {
  hidden: boolean;
}

class Ask {
  async execute(
    questionInput: string,
    optionsAsk?: OptionsAsk
  ): Promise<string> {
    const question = this.trimAndAddSpace(questionInput);

    return new Promise(resolve => {
      const questionInterface = createInterface({
        input: process.stdin,
        output: this.output(question, optionsAsk?.hidden),
        terminal: true
      });

      questionInterface.question(question, answer => {
        questionInterface.close();
        resolve(answer);
      });
    });
  }

  private output(question: string, muted = false) {
    let printAsk = false;

    return new Writable({
      write(chunk: Buffer, encoding, callback) {
        if (!printAsk) {
          printAsk = true;
          process.stdout.write(question);
        }

        if (
          muted &&
          chunk.toString('base64') ===
            Buffer.from('\r\n', 'utf8').toString('base64')
        ) {
          process.stdout.write(chunk, encoding);
        }

        if (!muted) process.stdout.write(chunk, encoding);
        callback();
      }
    });
  }

  private trimAndAddSpace(value: string): string {
    return `${value.trim()} `;
  }
}

export const ask = new Ask().execute;
