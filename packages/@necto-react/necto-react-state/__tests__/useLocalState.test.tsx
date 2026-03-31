/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useLocalState } from '../src/index';

describe('useLocalState', () => {
  it('should work as a drop-in replacement for React useState', () => {
    const { result } = renderHook(() => useLocalState(0));

    expect(result.current[0]).toBe(0);
    expect(typeof result.current[1]).toBe('function');
  });

  it('should update value when setter is called', () => {
    const { result } = renderHook(() => useLocalState(0));

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
  });

  it('should support function updater', () => {
    const { result } = renderHook(() => useLocalState(10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
  });

  it('should support lazy initializer', () => {
    const initializer = vi.fn(() => 42);
    const { result, rerender } = renderHook(() => useLocalState(initializer));

    expect(result.current[0]).toBe(42);
    expect(initializer).toHaveBeenCalledTimes(1);

    rerender();

    expect(initializer).toHaveBeenCalledTimes(1);
  });

  it('should support string values', () => {
    const { result } = renderHook(() => useLocalState('hello'));

    expect(result.current[0]).toBe('hello');

    act(() => {
      result.current[1]('world');
    });

    expect(result.current[0]).toBe('world');
  });

  it('should support object values', () => {
    const { result } = renderHook(() => useLocalState({ count: 0 }));

    expect(result.current[0]).toEqual({ count: 0 });

    act(() => {
      result.current[1]({ count: 1 });
    });

    expect(result.current[0]).toEqual({ count: 1 });
  });

  it('should support null initial value', () => {
    const { result } = renderHook(() => useLocalState<string | null>(null));

    expect(result.current[0]).toBeNull();

    act(() => {
      result.current[1]('value');
    });

    expect(result.current[0]).toBe('value');
  });

  it('should keep state scoped to the component (not shared)', () => {
    const { result: result1 } = renderHook(() => useLocalState(0));
    const { result: result2 } = renderHook(() => useLocalState(0));

    act(() => {
      result1.current[1](5);
    });

    expect(result1.current[0]).toBe(5);
    expect(result2.current[0]).toBe(0);
  });

  it('should preserve state across re-renders', () => {
    const { result, rerender } = renderHook(() => useLocalState(0));

    act(() => {
      result.current[1](42);
    });

    rerender();

    expect(result.current[0]).toBe(42);
  });

  it('should not re-render when setting the same value', () => {
    const renderCount = vi.fn();

    const { result } = renderHook(() => {
      renderCount();
      return useLocalState(0);
    });

    const initialRenders = renderCount.mock.calls.length;

    act(() => {
      result.current[1](0);
    });

    expect(renderCount.mock.calls.length).toBe(initialRenders);
  });

  it('should handle multiple sequential updates', () => {
    const { result } = renderHook(() => useLocalState(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3);
    });

    expect(result.current[0]).toBe(3);
  });

  it('should handle boolean values', () => {
    const { result } = renderHook(() => useLocalState(false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]((prev) => !prev);
    });

    expect(result.current[0]).toBe(false);
  });
});
