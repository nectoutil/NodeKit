/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { HTMLElements } from '../src/html-elements';

describe('HTMLElements', () => {
  it('maps capitalized names to lowercase tag strings', () => {
    expect(HTMLElements['Div']).toBe('div');
    expect(HTMLElements['Span']).toBe('span');
    expect(HTMLElements['Button']).toBe('button');
    expect(HTMLElements['Input']).toBe('input');
  });

  it('contains entries for common HTML tags', () => {
    const expected = ['div', 'span', 'button', 'input', 'form', 'p', 'a'];
    for (const tag of expected) {
      const key = tag.charAt(0).toUpperCase() + tag.slice(1);
      expect(HTMLElements[key]).toBe(tag);
    }
  });

  it('has a non-empty map', () => {
    expect(Object.keys(HTMLElements).length).toBeGreaterThan(0);
  });

  it('each key is the capitalized version of its value', () => {
    for (const [key, value] of Object.entries(HTMLElements)) {
      const expected = value.charAt(0).toUpperCase() + value.slice(1);
      expect(key).toBe(expected);
    }
  });
});
