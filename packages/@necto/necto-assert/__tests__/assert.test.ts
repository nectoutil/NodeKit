/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

  it('should prefix the error name with "necto." to identify the source library', () => {
    const err = new AssertionError('fail');
    expect(err.name.startsWith('necto.')).toBe(true);
  });

  it('should include "necto.AssertionError" in the error name', () => {
    const err = new AssertionError('fail');
    expect(err.name).toContain('necto.AssertionError');
  });

  it('should include "necto.AssertionError" in toString() output', () => {
    const err = new AssertionError('fail');
    expect(err.toString()).toContain('necto.AssertionError');
  });

  it('should preserve the necto prefix when thrown from assert()', () => {
    try {
      assert(false, 'boom');
      expect.unreachable('assert should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AssertionError);
      expect((err as AssertionError).name).toContain('necto.AssertionError');
    }
  });

  it('should preserve the necto prefix across empty and non-empty messages', () => {
    expect(new AssertionError('').name).toContain('necto.AssertionError');
    expect(new AssertionError('some message').name).toContain('necto.AssertionError');
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

