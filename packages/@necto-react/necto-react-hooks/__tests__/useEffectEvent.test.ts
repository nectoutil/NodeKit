/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEffectEvent } from '@necto-react/hooks';

describe('useEffectEvent', () => {
  it('returns a stable function reference across re-renders', () => {
    const { result, rerender } = renderHook(
      ({ fn }) => useEffectEvent(fn),
      { initialProps: { fn: vi.fn() } }
    );
    const first = result.current;
    rerender({ fn: vi.fn() });
    expect(result.current).toBe(first);
  });

  it('always invokes the latest provided function', () => {
    const fn1 = vi.fn().mockReturnValue('first');
    const fn2 = vi.fn().mockReturnValue('second');
    const { result, rerender } = renderHook(
      ({ fn }) => useEffectEvent(fn),
      { initialProps: { fn: fn1 } }
    );
    rerender({ fn: fn2 });
    result.current();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn1).not.toHaveBeenCalled();
  });

  it('passes arguments through to the underlying function', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useEffectEvent(fn));
    result.current('a', 'b', 'c');
    expect(fn).toHaveBeenCalledWith('a', 'b', 'c');
  });

  it('returns the value from the underlying function', () => {
    const fn = vi.fn().mockReturnValue(42);
    const { result } = renderHook(() => useEffectEvent(fn));
    expect(result.current()).toBe(42);
  });
});
