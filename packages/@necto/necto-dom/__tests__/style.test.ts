/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { injectStyle } from '../src/style';

describe('injectStyle', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should inject a style element into the head', () => {
    const cleanup = injectStyle('.test { color: red; }');

    const style = document.querySelector('style[data-style-id]');
    expect(style).not.toBeNull();
    expect(style?.textContent).toBe('.test { color: red; }');

    cleanup();
  });

  it('should auto-generate a data-style-id with necto- prefix', () => {
    const cleanup = injectStyle('.test {}');

    const style = document.querySelector('style[data-style-id]');
    expect(style).not.toBeNull();
    expect(style?.getAttribute('data-style-id')).toMatch(/^necto-<:[a-z0-9]+:>$/);

    cleanup();
  });

  it('should set the HTML id attribute when id is provided', () => {
    const cleanup = injectStyle('.test {}', { id: 'my-component' });

    const style = document.querySelector('style#my-component');
    expect(style).not.toBeNull();
    expect(style?.id).toBe('my-component');
    expect(style?.getAttribute('data-style-id')).toMatch(/^necto-<:/);

    cleanup();
  });

  it('should not set HTML id when id is not provided', () => {
    const cleanup = injectStyle('.test {}');

    const style = document.querySelector('style[data-style-id]');
    expect(style).not.toBeNull();
    expect(style?.id).toBe('');

    cleanup();
  });

  it('should reuse the same style element for duplicate css + id', () => {
    const cleanup1 = injectStyle('.test {}', { id: 'shared' });
    const cleanup2 = injectStyle('.test {}', { id: 'shared' });

    const styles = document.querySelectorAll('style#shared');
    expect(styles.length).toBe(1);

    cleanup1();
    expect(document.querySelector('style#shared')).not.toBeNull();

    cleanup2();
    expect(document.querySelector('style#shared')).toBeNull();
  });

  it('should remove the style element when all references are cleaned up', () => {
    const cleanup = injectStyle('.test { color: blue; }', { id: 'removable' });

    expect(document.querySelector('style#removable')).not.toBeNull();

    cleanup();

    expect(document.querySelector('style#removable')).toBeNull();
  });

  it('should return a no-op cleanup when css is empty', () => {
    const cleanup = injectStyle('');

    expect(document.querySelector('style[data-style-id]')).toBeNull();

    cleanup();
  });

  it('should set type attribute to text/css', () => {
    const cleanup = injectStyle('.test {}');

    const style = document.querySelector('style[data-style-id]');
    expect(style?.getAttribute('type')).toBe('text/css');

    cleanup();
  });

  it('should have both data-style-id and id attributes', () => {
    const cleanup = injectStyle('.btn { padding: 8px; }', { id: 'necto-pressable' });

    const style = document.querySelector('style#necto-pressable');
    expect(style).not.toBeNull();
    expect(style?.getAttribute('data-style-id')).toMatch(/^necto-<:/);
    expect(style?.id).toBe('necto-pressable');
    expect(style?.textContent).toBe('.btn { padding: 8px; }');

    cleanup();
  });

  it('should generate unique internal ids for different css strings', () => {
    const cleanup1 = injectStyle('.a {}');
    const cleanup2 = injectStyle('.b {}');

    const styles = document.querySelectorAll('style[data-style-id]');
    expect(styles.length).toBe(2);

    const id1 = styles[0]?.getAttribute('data-style-id');
    const id2 = styles[1]?.getAttribute('data-style-id');
    expect(id1).not.toBe(id2);

    cleanup1();
    cleanup2();
  });
});
