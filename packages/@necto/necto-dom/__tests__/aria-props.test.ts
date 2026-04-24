/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { AriaProps, ALL_ARIA_PROPS, ARIA_PROPS_SET, isAriaAttribute, hasAriaPrefix } from '../src/aria-props';

describe('AriaProps', () => {
  it('maps capitalized keys to aria attribute names', () => {
    expect(AriaProps['Pressed']).toBe('aria-pressed');
    expect(AriaProps['Disabled']).toBe('aria-disabled');
    expect(AriaProps['Label']).toBe('aria-label');
  });

  it('covers every attribute in ALL_ARIA_PROPS', () => {
    for (const attr of ALL_ARIA_PROPS) {
      const key = attr.replace('aria-', '');
      const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
      expect(AriaProps[capitalized]).toBe(attr);
    }
  });
});

describe('ALL_ARIA_PROPS', () => {
  it('is a non-empty array of valid ARIA identifiers', () => {
    expect(Array.isArray(ALL_ARIA_PROPS)).toBe(true);
    expect(ALL_ARIA_PROPS.length).toBeGreaterThan(0);
    for (const attr of ALL_ARIA_PROPS) {
      expect(attr === 'role' || attr.startsWith('aria-')).toBe(true);
    }
  });

  it('includes role as per the WAI-ARIA spec', () => {
    expect(ALL_ARIA_PROPS).toContain('role');
  });
});

describe('ARIA_PROPS_SET', () => {
  it('contains every entry from ALL_ARIA_PROPS', () => {
    for (const attr of ALL_ARIA_PROPS) {
      expect(ARIA_PROPS_SET.has(attr)).toBe(true);
    }
  });

  it('has the same size as ALL_ARIA_PROPS', () => {
    expect(ARIA_PROPS_SET.size).toBe(ALL_ARIA_PROPS.length);
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
