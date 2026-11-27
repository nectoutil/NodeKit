/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEventCallback } from '@necto-react/hooks';
import { render, renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('useEventCallback', () => {
  it('returns a stable function reference across re-renders', () => {
    const { result, rerender } = renderHook(({ fn }) => useEventCallback(fn), {
      initialProps: { fn: vi.fn() }
    });

    const first = result.current;
    rerender({ fn: vi.fn() });

    expect(result.current).toBe(first);
  });

  it('always invokes the latest provided function', () => {
    const fn1 = vi.fn().mockReturnValue('first');
    const fn2 = vi.fn().mockReturnValue('second');

    const { result, rerender } = renderHook(({ fn }) => useEventCallback(fn), {
      initialProps: { fn: fn1 }
    });

    rerender({ fn: fn2 });
    result.current();

    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn1).not.toHaveBeenCalled();
  });

  it('passes arguments through and returns the result', () => {
    const fn = vi.fn((a: number, b: number) => a + b);

    const { result } = renderHook(() => useEventCallback(fn));

    expect(result.current(2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledWith(2, 3);
  });

  it('tolerates an undefined callback after mount', () => {
    const { result } = renderHook(() => useEventCallback(undefined));

    expect(result.current).toBeTypeOf('function');
    expect(result.current?.()).toBeUndefined();
  });

  it('throws NT0204 when invoked during render', () => {
    function Offender(): null {
      const callback = useEventCallback(() => 'nope');

      callback();

      return null;
    }

    expect(() => render(<Offender />)).toThrow(/NT0204/);
  });
});
