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

describe('useLocalState signal-style API', () => {
  it('should expose .value for reading', () => {
    const { result } = renderHook(() => useLocalState(42));

    expect(result.current.value).toBe(42);
  });

  it('should expose .set() for direct value setting', () => {
    const { result } = renderHook(() => useLocalState(0));

    act(() => {
      result.current.set(123);
    });

    expect(result.current.value).toBe(123);
  });

  it('should expose .update() for function updates', () => {
    const { result } = renderHook(() => useLocalState(10));

    act(() => {
      result.current.update((c) => c + 1);
    });

    expect(result.current.value).toBe(11);
  });

  it('should expose .reset() to return to initial value', () => {
    const { result } = renderHook(() => useLocalState(5));

    act(() => {
      result.current.set(99);
    });

    expect(result.current.value).toBe(99);

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe(5);
  });

  it('should reset to lazy initializer value', () => {
    const { result } = renderHook(() => useLocalState(() => 42));

    act(() => {
      result.current.set(0);
    });

    expect(result.current.value).toBe(0);

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe(42);
  });

  it('should work with both destructure and signal style in the same hook', () => {
    const { result } = renderHook(() => useLocalState(0));

    act(() => {
      result.current.set(10);
    });

    expect(result.current[0]).toBe(10);
    expect(result.current.value).toBe(10);

    act(() => {
      result.current[1](20);
    });

    expect(result.current.value).toBe(20);
    expect(result.current[0]).toBe(20);
  });

  it('should chain multiple signal operations', () => {
    const { result } = renderHook(() => useLocalState(0));

    act(() => {
      result.current.set(5);
    });

    act(() => {
      result.current.update((v) => v * 3);
    });

    expect(result.current.value).toBe(15);

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe(0);
  });

  it('should work with object values', () => {
    const { result } = renderHook(() => useLocalState({ name: 'John', age: 30, height: "6ft, 3in" }));

    act(() => {
      result.current.set({ name: 'Jane', age: 25, height: "5ft, 3in" });
    });

    expect(result.current.value).toEqual({ name: 'Jane', age: 25, height: "5ft, 3in" });

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toEqual({ name: 'John', age: 30, height: "6ft, 3in" });
  });
});
