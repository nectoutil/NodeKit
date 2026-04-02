import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getOwnerDocument, getOwnerWindow } from '../src/owner';

describe('getOwnerDocument', () => {
  it('returns the ownerDocument of an element', () => {
    const el = document.createElement('div');
    expect(getOwnerDocument(el)).toBe(document);
  });

  it('returns global document when element is null', () => {
    expect(getOwnerDocument(null)).toBe(document);
  });

  it('returns global document when element is undefined', () => {
    expect(getOwnerDocument(undefined)).toBe(document);
  });

  it('does not throw when document is undefined (SSR)', () => {
    const originalDocument = globalThis.document;
    // @ts-expect-error — simulating SSR
    delete globalThis.document;

    expect(() => getOwnerDocument(null)).not.toThrow();
    expect(getOwnerDocument(null)).toBeNull();

    globalThis.document = originalDocument;
  });
});

describe('getOwnerWindow', () => {
  it('returns the window for a DOM element', () => {
    const el = document.createElement('div');
    expect(getOwnerWindow(el)).toBe(window);
  });

  it('returns the window object when passed a window', () => {
    expect(getOwnerWindow(window)).toBe(window);
  });

  it('returns window when element is null', () => {
    expect(getOwnerWindow(null)).toBe(window);
  });

  it('does not throw when document and window are undefined (SSR)', () => {
    const originalDocument = globalThis.document;
    const originalWindow = globalThis.window;
    // @ts-expect-error — simulating SSR
    delete globalThis.document;
    // @ts-expect-error — simulating SSR
    delete globalThis.window;

    expect(() => getOwnerWindow(null)).not.toThrow();

    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
  });
});
