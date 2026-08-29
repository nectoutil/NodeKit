/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMounted } from '@necto-react/hooks';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('useMounted', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return a boolean by default', () => {
    const { result } = renderHook(() => useMounted());

    expect(typeof result.current).toBe('boolean');
  });

  it('should accept options without a type', () => {
    const { result } = renderHook(() => useMounted({ defer: true }));

    expect(typeof result.current).toBe('boolean');
  });

  it('should return true when component is mounted', () => {
    const { result } = renderHook(() => useMounted({ type: 'function' }));

    act(() => {});
    expect(result.current()).toBe(true);
  });

  it('should return false after unmount', () => {
    const { result, unmount } = renderHook(() => useMounted({ type: 'function' }));

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

  it('should be true during the mounting commit by default', () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useMounted({ type: 'boolean' }));

    expect(result.current).toBe(true);
  });

  it('should stay false through the mounting commit when deferred', () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useMounted({ type: 'boolean', defer: true }));

    expect(result.current).toBe(false);
  });

  it('should turn true once the task runs when deferred', () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useMounted({ type: 'boolean', defer: true }));

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(true);
  });

  it('should flip every access type at the same moment when deferred', () => {
    vi.useFakeTimers();

    const ref = renderHook(() => useMounted({ type: 'ref', defer: true }));
    const get = renderHook(() => useMounted({ type: 'function', defer: true }));

    expect(ref.result.current.current).toBe(false);
    expect(get.result.current()).toBe(false);

    act(() => {
      vi.runAllTimers();
    });

    expect(ref.result.current.current).toBe(true);
    expect(get.result.current()).toBe(true);
  });

  it('should clear the pending task on unmount', () => {
    vi.useFakeTimers();

    const { unmount } = renderHook(() => useMounted({ defer: true }));

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
