/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { isShadowRoot } from '../src/shadow-dom';

describe('isShadowRoot', () => {
  it('returns true for a real ShadowRoot', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    expect(isShadowRoot(shadowRoot)).toBe(true);

    document.body.removeChild(host);
  });

  it('returns false for a regular element', () => {
    expect(isShadowRoot(document.createElement('div'))).toBe(false);
  });

  it('returns false for null', () => {
    expect(isShadowRoot(null)).toBe(false);
  });

  it('returns false for a plain DocumentFragment', () => {
    expect(isShadowRoot(document.createDocumentFragment())).toBe(false);
  });

  it('returns false for a text node', () => {
    expect(isShadowRoot(document.createTextNode('hello'))).toBe(false);
  });
});
