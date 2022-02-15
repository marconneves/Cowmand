import { createInterface } from 'readline';
import { Writable } from 'stream';

export interface OptionsAsk {
  hidden: boolean;
}

const ask = async function ask(
  question: string,
  optionsAsk?: OptionsAsk
): Promise<string> {
  return new Promise(resolve => {
    let muted = false;
    let printAsk = false;

    const output = new Writable({
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

    const questionInterface = createInterface({
      input: process.stdin,
      output,
      terminal: true
    });

    muted = optionsAsk?.hidden || false;

    questionInterface.question(question, answer => {
      questionInterface.close();
      resolve(answer);
    });
  });
};

export { ask };
