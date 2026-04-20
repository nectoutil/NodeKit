/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useLayoutEffect } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsomorphicInsertionEffect } from '@necto-react/hooks';

describe('useIsomorphicInsertionEffect', () => {
  it('is a function', () => {
    expect(typeof useIsomorphicInsertionEffect).toBe('function');
  });

  it('resolves to React.useInsertionEffect when available', () => {
    if ((React as any).useInsertionEffect) {
      expect(useIsomorphicInsertionEffect).toBe((React as any).useInsertionEffect);
    } else {
      expect(useIsomorphicInsertionEffect).toBe(useLayoutEffect);
    }
  });

  it('runs the effect callback', () => {
    const callback = vi.fn();
    renderHook(() => { useIsomorphicInsertionEffect(callback); });
    expect(callback).toHaveBeenCalledOnce();
  });

  it('runs cleanup on unmount', () => {
    const cleanup = vi.fn();
    const { unmount } = renderHook(() => {
      useIsomorphicInsertionEffect(() => cleanup);
    });

    expect(cleanup).not.toHaveBeenCalled();
    unmount();
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it('re-runs when dependencies change', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ dep }: { dep: number }) => { useIsomorphicInsertionEffect(callback, [dep]); },
      { initialProps: { dep: 1 } }
    );

    expect(callback).toHaveBeenCalledTimes(1);
    rerender({ dep: 2 });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('does not re-run when dependencies are unchanged', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ dep }: { dep: number }) => { useIsomorphicInsertionEffect(callback, [dep]); },
      { initialProps: { dep: 1 } }
    );

    rerender({ dep: 1 });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
