import { terminal } from '../../src/Terminal';
import { ask } from '../../src/Terminal/ask';

jest.mock('readline', () => ({
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn().mockImplementationOnce((question, callback) => {
      callback('answer');
    }),
    close: jest.fn()
  })
}));

describe('Terminal', () => {
  it('should be create a terminal', () => {
    expect(terminal).toBeInstanceOf(Object);
  });

  describe('log', () => {
    it('should be log a message', () => {
      const spy = jest.spyOn(console, 'log');
      terminal.log('test');
      expect(spy).toBeCalledWith('test');
    });
  });

  describe('error', () => {
    it('should be log an error', () => {
      const spy = jest.spyOn(console, 'log');
      terminal.error('test', ['test']);
      expect(spy).toBeCalled();
    });
  });

  describe('table', () => {
    it('should be log a table', () => {
      const spy = jest.spyOn(console, 'table');
      terminal.table([{ test: 'test' }]);
      expect(spy).toBeCalledWith([{ test: 'test' }]);
    });
  });

  describe('ask', () => {
    it('should be ask a question', async () => {
      const answer = await ask('test');
      expect(answer).toStrictEqual('answer');
    });
  });
});
