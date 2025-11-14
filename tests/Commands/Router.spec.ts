import { Router } from '../../src/Commands/Router';

describe('Router', () => {
  it('should be create a router', () => {
    const router = Router();
    expect(router).toBeInstanceOf(Object);
  });

  it('should be create a router with a stack', () => {
    const router = Router();
    expect(router.stack).toBeInstanceOf(Array);
  });

  describe('use', () => {
    it('should be add a layer to the stack', () => {
      const router = Router();
      router.use(() => undefined);
      expect(router.stack.length).toStrictEqual(1);
    });

    it('should be add a layer to the stack with a command', () => {
      const router = Router();
      router.use('test', () => undefined);
      expect(router.stack.length).toStrictEqual(1);
      expect(router.stack[0].command).toStrictEqual('test');
    });

    it('should be add a layer to the stack with a command and a handle', () => {
      const router = Router();
      const handle = () => undefined;
      router.use('test', handle);
      expect(router.stack.length).toStrictEqual(1);
      expect(router.stack[0].command).toStrictEqual('test');
      expect(router.stack[0].handle).toStrictEqual(handle);
    });
  });

  describe('start', () => {
    it('should be start the router', () => {
      const router = Router();
      const mock = jest.fn();
      router.use('test', mock);
      router.start(
        {},
        {
          command: 'test',
          subCommands: [],
          flags: new Map()
        }
      );
      expect(mock).toBeCalled();
    });

    it('should be start the router with a sub command', () => {
      const router = Router();
      const mock = jest.fn();
      router.use('test', mock);
      router.start(
        {},
        {
          command: 'test',
          subCommands: ['sub'],
          flags: new Map()
        }
      );
      expect(mock).toBeCalled();
    });
  });
});
