/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { toPx } from '../src/css';

describe('toPx', () => {
  it('converts a number to a px string', () => {
    expect(toPx(16)).toBe('16px');
    expect(toPx(0)).toBe('0px');
    expect(toPx(100)).toBe('100px');
  });

  it('passes a string through unchanged', () => {
    expect(toPx('50%')).toBe('50%');
    expect(toPx('auto')).toBe('auto');
    expect(toPx('2rem')).toBe('2rem');
  });

  it('returns undefined when value is undefined', () => {
    expect(toPx(undefined)).toBeUndefined();
    expect(toPx()).toBeUndefined();
  });

  it('handles negative numbers', () => {
    expect(toPx(-10)).toBe('-10px');
  });

  it('handles decimal numbers', () => {
    expect(toPx(1.5)).toBe('1.5px');
  });
});
