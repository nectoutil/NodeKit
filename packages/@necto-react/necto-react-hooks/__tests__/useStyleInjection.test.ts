/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStyleInjection } from '@necto-react/hooks';

function getStyleById(id: string): HTMLStyleElement | null {
  return document.getElementById(id) as HTMLStyleElement | null;
}

describe('useStyleInjection', () => {
  beforeEach(() => {
    // Remove any injected style tags between tests
    document.querySelectorAll('style[id^="test-"]').forEach((el) => el.remove());
    document.querySelectorAll('style[id="necto-pressable"]').forEach((el) => el.remove());
  });

  it('injects a style tag into document head with the given id', () => {
    renderHook(() => useStyleInjection({ id: 'test-basic', css: 'body { color: red; }' }));
    act(() => {});
    const style = getStyleById('test-basic');
    expect(style).not.toBeNull();
    expect(style?.textContent).toBe('body { color: red; }');
  });

  it('joins array css with newlines', () => {
    renderHook(() =>
      useStyleInjection({ id: 'test-array', css: ['body {', '  color: red;', '}'] })
    );
    act(() => {});
    const style = getStyleById('test-array');
    expect(style?.textContent).toBe('body {\n  color: red;\n}');
  });

  it('does not inject when enabled is false', () => {
    renderHook(() =>
      useStyleInjection({ id: 'test-disabled', css: 'body { color: red; }', enabled: false })
    );
    act(() => {});
    expect(getStyleById('test-disabled')).toBeNull();
  });

  it('does not inject when enabled is toggled to false', () => {
    const { rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useStyleInjection({ id: 'test-toggle', css: 'body { color: red; }', enabled }),
      { initialProps: { enabled: true } }
    );
    act(() => {});
    expect(getStyleById('test-toggle')).not.toBeNull();

    rerender({ enabled: false });
    act(() => {});
    expect(getStyleById('test-toggle')).toBeNull();
  });

  it('removes the style tag on unmount', () => {
    const { unmount } = renderHook(() =>
      useStyleInjection({ id: 'test-unmount', css: 'body { color: red; }' })
    );
    act(() => {});
    expect(getStyleById('test-unmount')).not.toBeNull();
    unmount();
    expect(getStyleById('test-unmount')).toBeNull();
  });

  it('does not inject when window is null (SSR)', () => {
    renderHook(() =>
      useStyleInjection({ id: 'test-ssr', css: 'body { color: red; }', window: null })
    );
    act(() => {});
    expect(getStyleById('test-ssr')).toBeNull();
  });

  it('uses enabled=true as default', () => {
    renderHook(() => useStyleInjection({ id: 'test-default-enabled', css: 'a { color: blue; }' }));
    act(() => {});
    expect(getStyleById('test-default-enabled')).not.toBeNull();
  });

  it('does not inject when css is an empty string', () => {
    renderHook(() => useStyleInjection({ id: 'test-empty-css', css: '' }));
    act(() => {});
    expect(getStyleById('test-empty-css')).toBeNull();
  });

  it('re-injects when css changes', () => {
    const { rerender } = renderHook(
      ({ css }: { css: string }) => useStyleInjection({ id: 'test-update', css }),
      { initialProps: { css: 'body { color: red; }' } }
    );
    act(() => {});
    expect(getStyleById('test-update')?.textContent).toBe('body { color: red; }');

    rerender({ css: 'body { color: blue; }' });
    act(() => {});
    expect(getStyleById('test-update')?.textContent).toBe('body { color: blue; }');
  });
});
