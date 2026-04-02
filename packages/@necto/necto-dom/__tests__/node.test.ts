/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { getActiveElement, isNode, nodeContains } from '../src/node';

describe('getActiveElement', () => {
  it('returns the active element', () => {
    const el = document.createElement('button');
    document.body.appendChild(el);
    el.focus();

    expect(getActiveElement()).toBe(el);

    document.body.removeChild(el);
  });

  it('returns body or null when nothing is focused', () => {
    const active = getActiveElement();
    expect(active === document.body || active === null).toBe(true);
  });

  it('does not throw when document is undefined (SSR)', () => {
    const originalDocument = globalThis.document;
    // @ts-expect-error — simulating SSR
    delete globalThis.document;

    expect(() => getActiveElement()).not.toThrow();
    expect(getActiveElement()).toBeNull();

    globalThis.document = originalDocument;
  });
});

describe('isNode', () => {
  it('returns true for DOM nodes', () => {
    expect(isNode(document.createElement('div'))).toBe(true);
    expect(isNode(document.createTextNode('text'))).toBe(true);
  });

  it('returns false for non-nodes', () => {
    expect(isNode(null)).toBe(false);
    expect(isNode(undefined)).toBe(false);
    expect(isNode('string')).toBe(false);
    expect(isNode(123)).toBe(false);
    expect(isNode({})).toBe(false);
  });
});

describe('nodeContains', () => {
  it('returns true when parent contains child', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);

    expect(nodeContains(parent, child)).toBe(true);
  });

  it('returns false when parent does not contain child', () => {
    const parent = document.createElement('div');
    const other = document.createElement('span');

    expect(nodeContains(parent, other)).toBe(false);
  });

  it('returns false for null inputs', () => {
    expect(nodeContains(null, null)).toBe(false);
    expect(nodeContains(document.createElement('div'), null)).toBe(false);
  });
});
