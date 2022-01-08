import proto from './program';

function createProgram() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const program = proto;

  program.init();
  return program;
}

export { Context, NextFunction } from './program';
export { Terminal } from './terminal';

export { createProgram };
export default createProgram;
