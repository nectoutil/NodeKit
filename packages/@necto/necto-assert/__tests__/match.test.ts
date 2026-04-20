/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { assertMatch, AssertionError } from '../src/index';

describe('assertMatch', () => {
  it('should not throw when the string matches the pattern', () => {
    expect(() => assertMatch('hello world', /world/)).not.toThrow();
  });

  it('should not throw for a full match', () => {
    expect(() => assertMatch('hello', /^hello$/)).not.toThrow();
  });

  it('should throw AssertionError with formatted message on mismatch', () => {
    expect(() => assertMatch('hello', /world/)).toThrow(AssertionError);
    expect(() => assertMatch('hello', /world/)).toThrow(
      'Expected actual: "hello" to match: "/world/".'
    );
  });

  it('should append a custom message as suffix on mismatch', () => {
    expect(() => assertMatch('hello', /world/, 'needs world')).toThrow(
      ': needs world'
    );
  });
});
