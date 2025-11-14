import { program } from '../src/program';

describe('Program', () => {
  beforeEach(() => {
    program.init();
  });

  it('should be have a command as a "/"', () => {
    expect(program.params.command).toStrictEqual('/');
  });

  describe('parseArguments', () => {
    it('should be parse the arguments', () => {
      program.parseArguments(['', '', 'test']);
      expect(program.params.command).toStrictEqual('test');
    });

    it('should be parse the arguments with subcommands', () => {
      program.parseArguments(['', '', 'test', 'subcommand']);
      expect(program.params.command).toStrictEqual('test');
      expect(program.params.subCommands).toStrictEqual(['subcommand']);
    });

    it('should be parse the arguments with flags', () => {
      program.parseArguments(['', '', 'test', '--flag']);
      expect(program.params.command).toStrictEqual('test');
      expect(program.params.flags.get('--flag')).toStrictEqual(true);
    });

    it('should be parse the arguments with flags and value', () => {
      program.parseArguments(['', '', 'test', '--flag', 'value']);
      expect(program.params.command).toStrictEqual('test');
      expect(program.params.flags.get('--flag')).toStrictEqual('value');
    });

    it('should be parse the arguments with flags and value with equals', () => {
      program.parseArguments(['', '', 'test', '--flag=value']);
      expect(program.params.command).toStrictEqual('test');
      expect(program.params.flags.get('--flag')).toStrictEqual('value');
    });

    it('should be parse the arguments with flags and subcommands', () => {
      program.parseArguments(['', '', 'test', 'subcommand', '--flag']);
      expect(program.params.command).toStrictEqual('test');
      expect(program.params.subCommands).toStrictEqual(['subcommand']);
      expect(program.params.flags.get('--flag')).toStrictEqual(true);
    });

    it('should be parse the arguments with flags and subcommands and value', () => {
      program.parseArguments(['', '', 'test', 'subcommand', '--flag', 'value']);
      expect(program.params.command).toStrictEqual('test');
      expect(program.params.subCommands).toStrictEqual(['subcommand']);
      expect(program.params.flags.get('--flag')).toStrictEqual('value');
    });
  });

  describe('use', () => {
    it('should be add a layer to the router', () => {
      program.use(() => undefined);
      expect(program.routeBase?.stack.length).toStrictEqual(1);
    });
  });

  describe('start', () => {
    it('should be start the program', () => {
      const mock = jest.fn();
      program.start(mock);
      expect(mock).toBeCalled();
    });
  });
});
