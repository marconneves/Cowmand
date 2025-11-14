import proto from './program.js';

function createProgram() {
  const program = proto;

  program.init();
  return program;
}

export type { Context, NextFunction } from './Commands/Layer.js';
export type { Terminal } from './Terminal/index.js';
export { Router } from './Commands/Router.js';

export { createProgram };
export default createProgram;
