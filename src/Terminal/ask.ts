import { createInterface } from 'readline';
import { Writable } from 'stream';

export interface OptionsAsk {
  hidden: boolean;
}

const AskProto = {
  async execute(
    questionInput: string,
    optionsAsk?: OptionsAsk
  ): Promise<string> {
    const question = AskProto.trimAndAddSpace(questionInput);

    return new Promise(resolve => {
      const questionInterface = createInterface({
        input: process.stdin,
        output: AskProto.output(question, optionsAsk?.hidden),
        terminal: true
      });

      questionInterface.question(question, answer => {
        questionInterface.close();
        resolve(answer);
      });
    });
  },

  output(question: string, muted = false) {
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
  },

  trimAndAddSpace(value: string): string {
    return `${value.trim()} `;
  }
};

export const ask = AskProto.execute;
