/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLayoutEffect } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsomorphicLayoutEffect } from '@necto-react/hooks';

describe('useIsomorphicLayoutEffect', () => {
  it('should be a function', () => {
    expect(typeof useIsomorphicLayoutEffect).toBe('function');
  });

  it('should resolve to useLayoutEffect in a browser environment', () => {
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
  });

  it('should execute the effect callback', () => {
    const callback = vi.fn();

    renderHook(() => {
      useIsomorphicLayoutEffect(callback);
    });

    expect(callback).toHaveBeenCalledOnce();
  });

  it('should execute cleanup on unmount', () => {
    const cleanup = vi.fn();
    const callback = vi.fn(() => cleanup);

    const { unmount } = renderHook(() => {
      useIsomorphicLayoutEffect(callback);
    });

    expect(cleanup).not.toHaveBeenCalled();

    unmount();

    expect(cleanup).toHaveBeenCalledOnce();
  });

  it('should re-run when dependencies change', () => {
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ dep }) => {
        useIsomorphicLayoutEffect(callback, [dep]);
      },
      { initialProps: { dep: 1 } }
    );

    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not re-run when dependencies are unchanged', () => {
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ dep }) => {
        useIsomorphicLayoutEffect(callback, [dep]);
      },
      { initialProps: { dep: 1 } }
    );

    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ dep: 1 });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
