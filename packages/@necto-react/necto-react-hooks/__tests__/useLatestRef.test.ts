/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLatestRef } from '@necto-react/hooks';

describe('useLatestRef', () => {
  it('holds the initial value', () => {
    const { result } = renderHook(() => useLatestRef(42));
    expect(result.current.current).toBe(42);
  });

  it('updates to the latest value on re-render', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLatestRef(value),
      { initialProps: { value: 1 } }
    );
    expect(result.current.current).toBe(1);
    rerender({ value: 2 });
    expect(result.current.current).toBe(2);
  });

  it('returns the same ref object across re-renders', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLatestRef(value),
      { initialProps: { value: 'a' } }
    );
    const first = result.current;
    rerender({ value: 'b' });
    expect(result.current).toBe(first);
  });

  it('works with object values', () => {
    const obj = { foo: 'bar' };
    const { result } = renderHook(() => useLatestRef(obj));
    expect(result.current.current).toBe(obj);
  });

  it('works with function values', () => {
    const fn = () => 'hello';
    const { result } = renderHook(() => useLatestRef(fn));
    expect(result.current.current).toBe(fn);
  });
});
