import proto from './program';

function createProgram() {
  const program = proto;

  program.init();
  return program;
}

export { Context, NextFunction } from './Commands/Layer';
export { Terminal } from './Terminal';

export { createProgram };
export default createProgram;
