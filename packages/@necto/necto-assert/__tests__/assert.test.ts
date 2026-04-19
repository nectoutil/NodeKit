import { describe, it, expect } from 'vitest';
import { assert, AssertionError } from '../src/index';

describe('AssertionError', () => {
  it('should be an instance of Error with the correct name', () => {
    const err = new AssertionError('fail');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('necto.AssertionError: Assertion failed.');
    expect(err.message).toBe('fail');
  });

  it('should forward ErrorOptions cause', () => {
    const cause = new Error('root');
    expect(new AssertionError('wrap', { cause }).cause).toBe(cause);
  });
});

describe('assert', () => {
  it('should not throw for truthy values', () => {
    expect(() => assert(true)).not.toThrow();
    expect(() => assert(1)).not.toThrow();
    expect(() => assert('hello')).not.toThrow();
    expect(() => assert({})).not.toThrow();
  });

  it('should throw AssertionError for falsy values', () => {
    expect(() => assert(false)).toThrow(AssertionError);
    expect(() => assert(null)).toThrow(AssertionError);
    expect(() => assert(undefined)).toThrow(AssertionError);
    expect(() => assert(0)).toThrow(AssertionError);
    expect(() => assert('')).toThrow(AssertionError);
  });

  it('should include the provided message on failure', () => {
    expect(() => assert(false, 'must be true')).toThrow('must be true');
  });
});

