/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { describe, it, expect } from 'vitest';
import { useId } from '@necto-react-hooks/useId';
import { renderHook } from '@testing-library/react';

describe('useId Hook', () => {
  it('generates a unique ID with the default prefix if none is provided', () => {
    const { result } = renderHook(() => useId());
    expect(result.current).toMatch(/^necto-(«r\d+»|\d+-\d+)$/);
  });

  it('generates ID with a custom prefix', () => {
    const customPrefix = 'custom';
    const { result } = renderHook(() => useId({ prefix: customPrefix }));
    expect(result.current).toMatch(/^custom-(«r\d+»|\d+-\d+)$/);
  });

  it('returns the provided defaultId if given', () => {
    const defaultId = 'my-default-id';
    const { result } = renderHook(() => useId({ prefix: 'custom', defaultId }));
    expect(result.current).toBe(defaultId);
  });

  it('does not change the ID across re-renders', () => {
    const { result, rerender } = renderHook(() => useId({ prefix: 'stable' }));
    const firstId = result.current;
    rerender(); // Trigger re-render
    expect(result.current).toBe(firstId);
  });

  it('generates unique IDs across different hooks', () => {
    const { result: result1 } = renderHook(() => useId({ prefix: 'unique1' }));
    const { result: result2 } = renderHook(() => useId({ prefix: 'unique2' }));
    expect(result1.current).not.toBe(result2.current);
  });
});
