/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { AriaProps, isAriaAttribute, hasAriaPrefix } from '../src/aria-props';

describe('AriaProps', () => {
  it('maps capitalized keys to aria attribute names', () => {
    expect(AriaProps['Pressed']).toBe('aria-pressed');
    expect(AriaProps['Disabled']).toBe('aria-disabled');
    expect(AriaProps['Label']).toBe('aria-label');
    expect(AriaProps['Role']).toBe('role');
  });
});

describe('isAriaAttribute', () => {
  it('returns true for valid aria attributes', () => {
    expect(isAriaAttribute('aria-pressed')).toBe(true);
    expect(isAriaAttribute('aria-label')).toBe(true);
    expect(isAriaAttribute('aria-disabled')).toBe(true);
  });

  it('returns false for non-aria strings', () => {
    expect(isAriaAttribute('data-foo')).toBe(false);
    expect(isAriaAttribute('onClick')).toBe(false);
    expect(isAriaAttribute('class')).toBe(false);
    expect(isAriaAttribute('aria-fake')).toBe(false);
  });
});

describe('hasAriaPrefix', () => {
  it('returns true for strings starting with aria-', () => {
    expect(hasAriaPrefix('aria-pressed')).toBe(true);
    expect(hasAriaPrefix('aria-anything')).toBe(true);
  });

  it('returns false for strings not starting with aria-', () => {
    expect(hasAriaPrefix('data-foo')).toBe(false);
    expect(hasAriaPrefix('onClick')).toBe(false);
    expect(hasAriaPrefix('')).toBe(false);
  });
});
