import { readRandomLine } from '../src';

describe('index', () => {
  describe('myPackage', () => {
    it('should return a string containing the message', () => {
      const message = 'Hello';

      const result = readRandomLine('../package.json');

      expect(result).toMatch(message);
    });
  });
});
