/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { describe, it, expect } from 'vitest';
import { useMounted } from '@necto-react/hooks';
import { renderHook, act } from '@testing-library/react';

describe('useMounted', () => {
  it('should return a function by default', () => {
    const { result } = renderHook(() => useMounted());

    expect(typeof result.current).toBe('function');
  });

  it('should return true when component is mounted', () => {
    const { result } = renderHook(() => useMounted());

    act(() => {});
    expect(result.current()).toBe(true);
  });

  it('should return false after unmount', () => {
    const { result, unmount } = renderHook(() => useMounted());

    act(() => {});
    expect(result.current()).toBe(true);

    unmount();
    expect(result.current()).toBe(false);
  });

  it('should return ref when type is ref', () => {
    const { result } = renderHook(() => useMounted({ type: 'ref' }));

    expect(result.current).toHaveProperty('current');
    act(() => {});
    expect(result.current.current).toBe(true);
  });

  it('should return boolean when type is boolean', () => {
    const { result } = renderHook(() => useMounted({ type: 'boolean' }));

    act(() => {});
    expect(result.current).toBe(true);
  });
});
