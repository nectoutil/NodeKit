import { describe, it, expect } from 'vitest';

import { capitalize } from '../src/index';

describe('capitalize', () => {
  it('should capitalize the first letter of a lowercase string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should return an empty string unchanged', () => {
    expect(capitalize('')).toBe('');
  });

  it('should capitalize only the first letter and leave the rest unchanged', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('should not change an already capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle an all-uppercase string without changing non-first letters', () => {
    expect(capitalize('HELLO')).toBe('HELLO');
  });

  it('should handle a single lowercase character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle a single uppercase character', () => {
    expect(capitalize('A')).toBe('A');
  });
});
