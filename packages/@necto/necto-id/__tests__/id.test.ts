import { describe, it, expect } from 'vitest';
import { id } from '../src/index';

describe('id', () => {
  it('should return a string of the default length (21)', () => {
    expect(id()).toHaveLength(21);
  });

  it('should return a string of the requested length', () => {
    expect(id(8)).toHaveLength(8);
    expect(id(64)).toHaveLength(64);
  });

  it('should only contain characters from the default charset (a-z A-Z)', () => {
    expect(id(100)).toMatch(/^[a-zA-Z]+$/);
  });

  it('should only contain characters from a custom charset', () => {
    const result = id(50, ['0', '1']);
    expect(result).toMatch(/^[01]+$/);
  });

  it('should produce unique values across calls', () => {
    const results = new Set(Array.from({ length: 100 }, () => id()));
    expect(results.size).toBe(100);
  });

  it('should throw when length is 0', () => {
    expect(() => id(0)).toThrow('Length must be a positive integer.');
  });

  it('should throw when length is negative', () => {
    expect(() => id(-1)).toThrow('Length must be a positive integer.');
  });
});
