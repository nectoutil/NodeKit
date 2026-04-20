/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { disableTextSelection, restoreTextSelection } from '../src/text-selection';

describe('disableTextSelection', () => {
  it('sets userSelect to none on the target element', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    disableTextSelection(el);
    expect(el.style.userSelect).toBe('none');

    restoreTextSelection(el);
    document.body.removeChild(el);
  });

  it('does not throw when called without a target', () => {
    expect(() => disableTextSelection()).not.toThrow();
    expect(() => disableTextSelection(undefined)).not.toThrow();
  });

  it('does not modify an element that is already tracked', () => {
    const el = document.createElement('div');
    el.style.userSelect = 'text';

    disableTextSelection(el);
    disableTextSelection(el); // second call is a no-op
    expect(el.style.userSelect).toBe('none');

    restoreTextSelection(el);
  });
});

describe('restoreTextSelection', () => {
  it('restores the original userSelect value', () => {
    const el = document.createElement('div');
    el.style.userSelect = 'text';

    disableTextSelection(el);
    expect(el.style.userSelect).toBe('none');

    restoreTextSelection(el);
    expect(el.style.userSelect).toBe('text');
  });

  it('removes the style attribute when it becomes empty after restoring', () => {
    const el = document.createElement('div');

    disableTextSelection(el);
    restoreTextSelection(el);

    expect(el.hasAttribute('style')).toBe(false);
  });

  it('does not throw when called without a prior disable', () => {
    const el = document.createElement('div');
    expect(() => restoreTextSelection(el)).not.toThrow();
  });

  it('does not throw when called without a target', () => {
    expect(() => restoreTextSelection()).not.toThrow();
    expect(() => restoreTextSelection(undefined)).not.toThrow();
  });
});
