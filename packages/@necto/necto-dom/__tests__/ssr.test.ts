/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/**
 * SSR safety tests — verify that all exported functions
 * handle missing `document` and `window` gracefully.
 */
describe('SSR safety', () => {
  let originalDocument: typeof document;
  let originalWindow: typeof window;

  beforeEach(() => {
    originalDocument = globalThis.document;
    originalWindow = globalThis.window;
  });

  afterEach(() => {
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
  });

  function simulateSSR() {
    // @ts-expect-error — simulating SSR environment
    delete globalThis.document;
    // @ts-expect-error — simulating SSR environment
    delete globalThis.window;
  }

  it('getOwnerDocument does not throw in SSR', async () => {
    simulateSSR();
    const { getOwnerDocument } = await import('../src/owner');
    expect(() => getOwnerDocument(null)).not.toThrow();
  });

  it('getOwnerWindow does not throw in SSR', async () => {
    simulateSSR();
    const { getOwnerWindow } = await import('../src/owner');
    expect(() => getOwnerWindow(null)).not.toThrow();
  });

  it('getActiveElement does not throw in SSR', async () => {
    simulateSSR();
    const { getActiveElement } = await import('../src/node');
    expect(() => getActiveElement()).not.toThrow();
    expect(getActiveElement()).toBeNull();
  });

  it('getContainmentRect does not throw in SSR', async () => {
    simulateSSR();
    const { getContainmentRect } = await import('../src/containment');
    expect(() => getContainmentRect(null)).not.toThrow();
    const rect = getContainmentRect(null);
    expect(rect).toEqual({ top: 0, left: 0, bottom: 0, right: 0 });
  });

  it('supportsPreventScroll does not throw in SSR', async () => {
    simulateSSR();
    const { supportsPreventScroll } = await import('../src/scroll');
    expect(() => supportsPreventScroll()).not.toThrow();
    expect(supportsPreventScroll()).toBe(false);
  });
});
