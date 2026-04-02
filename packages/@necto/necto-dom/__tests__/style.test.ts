// @vitest-environment jsdom

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { injectStyle } from '../src/style';

describe('injectStyle', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should inject a style element into the head', () => {
    const cleanup = injectStyle('.test { color: red; }');

    const style = document.querySelector('style[necto-style-id]');
    expect(style).not.toBeNull();
    expect(style?.textContent).toBe('.test { color: red; }');

    cleanup();
  });

  it('should set necto-style-id attribute with the provided id', () => {
    const cleanup = injectStyle('.test {}', { id: 'my-component' });

    const style = document.querySelector('style[necto-style-id="my-component"]');
    expect(style).not.toBeNull();

    cleanup();
  });

  it('should set default necto-style-id when no id is provided', () => {
    const cleanup = injectStyle('.test {}');

    const style = document.querySelector('style[necto-style-id="necto-style"]');
    expect(style).not.toBeNull();

    cleanup();
  });

  it('should set the HTML id attribute when elementId is provided', () => {
    const cleanup = injectStyle('.test {}', { id: 'internal', elementId: 'user-facing-id' });

    const style = document.querySelector('style#user-facing-id');
    expect(style).not.toBeNull();
    expect(style?.getAttribute('necto-style-id')).toBe('internal');
    expect(style?.id).toBe('user-facing-id');

    cleanup();
  });

  it('should not set HTML id when elementId is not provided', () => {
    const cleanup = injectStyle('.test {}', { id: 'internal' });

    const style = document.querySelector('style[necto-style-id="internal"]');
    expect(style).not.toBeNull();
    expect(style?.id).toBe('');

    cleanup();
  });

  it('should reuse the same style element for duplicate css + id', () => {
    const cleanup1 = injectStyle('.test {}', { id: 'shared' });
    const cleanup2 = injectStyle('.test {}', { id: 'shared' });

    const styles = document.querySelectorAll('style[necto-style-id="shared"]');
    expect(styles.length).toBe(1);

    cleanup1();
    // Style should still exist after first cleanup (refcount = 1)
    expect(document.querySelector('style[necto-style-id="shared"]')).not.toBeNull();

    cleanup2();
    // Style should be removed after second cleanup (refcount = 0)
    expect(document.querySelector('style[necto-style-id="shared"]')).toBeNull();
  });

  it('should remove the style element when all references are cleaned up', () => {
    const cleanup = injectStyle('.test { color: blue; }', { id: 'removable' });

    expect(document.querySelector('style[necto-style-id="removable"]')).not.toBeNull();

    cleanup();

    expect(document.querySelector('style[necto-style-id="removable"]')).toBeNull();
  });

  it('should return a no-op cleanup when css is empty', () => {
    const cleanup = injectStyle('', { id: 'empty' });

    expect(document.querySelector('style[necto-style-id="empty"]')).toBeNull();

    cleanup(); // should not throw
  });

  it('should set type attribute to text/css', () => {
    const cleanup = injectStyle('.test {}');

    const style = document.querySelector('style[necto-style-id]');
    expect(style?.getAttribute('type')).toBe('text/css');

    cleanup();
  });

  it('should have both necto-style-id and id attributes when both are provided', () => {
    const cleanup = injectStyle('.btn { padding: 8px; }', {
      id: 'necto-pressable',
      elementId: 'pressable-styles'
    });

    const style = document.querySelector('style#pressable-styles');
    expect(style).not.toBeNull();
    expect(style?.getAttribute('necto-style-id')).toBe('necto-pressable');
    expect(style?.id).toBe('pressable-styles');
    expect(style?.textContent).toBe('.btn { padding: 8px; }');

    cleanup();
  });
});
