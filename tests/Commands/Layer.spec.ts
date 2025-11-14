import { Layer } from '../../src/Commands/Layer';

describe('Layer', () => {
  it('should be create a layer', () => {
    const layer = new Layer('/', { subCommands: [], notInCommands: [] }, () => undefined);
    expect(layer).toBeInstanceOf(Layer);
  });

  it('should be create a layer with a command', () => {
    const layer = new Layer('test', { subCommands: [], notInCommands: [] }, () => undefined);
    expect(layer.command).toStrictEqual('test');
  });

  it('should be create a layer with a handle', () => {
    const handle = () => undefined;
    const layer = new Layer('test', { subCommands: [], notInCommands: [] }, handle);
    expect(layer.handle).toStrictEqual(handle);
  });

  it('should be create a layer with a handleError', () => {
    const handleError = () => undefined;
    const layer = new Layer(
      'test',
      { subCommands: [], notInCommands: [] },
      (ctx, terminal, next, error) => handleError()
    );
    expect(layer.handleError).toBeDefined();
  });

  describe('match', () => {
    it('should be match with a command', () => {
      const layer = new Layer('test', { subCommands: [], notInCommands: [] }, () => undefined);
      expect(layer.match('test')).toStrictEqual(true);
    });

    it('should be not match with a command', () => {
      const layer = new Layer('test', { subCommands: [], notInCommands: [] }, () => undefined);
      expect(layer.match('test2')).toStrictEqual(false);
    });

    it('should be match with a command and not in command', () => {
      const layer = new Layer(
        '/',
        { subCommands: [], notInCommands: ['test2'] },
        () => undefined
      );
      expect(layer.match('test')).toStrictEqual(true);
    });

    it('should be not match with a command and not in command', () => {
      const layer = new Layer(
        '/',
        { subCommands: [], notInCommands: ['test'] },
        () => undefined
      );
      expect(layer.match('test')).toStrictEqual(false);
    });
  });
});
