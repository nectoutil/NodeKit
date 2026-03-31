/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement } from 'react';

import { state, createStore } from '@necto/state';
import { useState, useStateValue, useSetState, Provider } from '../src/index';

import type { ReactNode } from 'react';
import type { Store } from '@necto/state';

function createWrapper(store: Store) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(Provider, { store }, children);
  };
}

describe('useState', () => {
  it('should return initial value and setter', () => {
    const count = state(0);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store),
    });

    expect(result.current[0]).toBe(0);
    expect(typeof result.current[1]).toBe('function');
  });

  it('should update when state changes', () => {
    const count = state(0);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
  });

  it('should support function updater', () => {
    const count = state(10);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
  });

  it('should not re-render when value is the same', () => {
    const count = state(0);
    const store = createStore();
    const renderCount = vi.fn();

    renderHook(
      () => {
        renderCount();
        return useState(count);
      },
      { wrapper: createWrapper(store) },
    );

    const initialRenders = renderCount.mock.calls.length;

    act(() => {
      store.set(count, 0);
    });

    expect(renderCount.mock.calls.length).toBe(initialRenders);
  });

  it('should react to external store.set calls', () => {
    const count = state(0);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store),
    });

    act(() => {
      store.set(count, 42);
    });

    expect(result.current[0]).toBe(42);
  });
});

describe('useStateValue', () => {
  it('should return the current value', () => {
    const name = state('hello');
    const store = createStore();

    const { result } = renderHook(() => useStateValue(name), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBe('hello');
  });

  it('should update when dependency changes', () => {
    const count = state(2);
    const doubled = state((get) => get(count) * 2);
    const store = createStore();

    const { result } = renderHook(() => useStateValue(doubled), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBe(4);

    act(() => {
      store.set(count, 5);
    });

    expect(result.current).toBe(10);
  });

  it('should work with derived states', () => {
    const firstName = state('John');
    const lastName = state('Doe');
    const fullName = state((get) => `${get(firstName)} ${get(lastName)}`);
    const store = createStore();

    const { result } = renderHook(() => useStateValue(fullName), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBe('John Doe');

    act(() => {
      store.set(firstName, 'Jane');
    });

    expect(result.current).toBe('Jane Doe');
  });
});

describe('useSetState', () => {
  it('should return a stable setter function', () => {
    const count = state(0);
    const store = createStore();

    const { result, rerender } = renderHook(() => useSetState(count), {
      wrapper: createWrapper(store),
    });

    const setter1 = result.current;
    rerender();
    const setter2 = result.current;

    expect(setter1).toBe(setter2);
  });

  it('should update the store when called', () => {
    const count = state(0);
    const store = createStore();

    const { result } = renderHook(() => useSetState(count), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current(10);
    });

    expect(store.get(count)).toBe(10);
  });

  it('should support function updater', () => {
    const count = state(5);
    const store = createStore();

    const { result } = renderHook(() => useSetState(count), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current((prev) => prev * 2);
    });

    expect(store.get(count)).toBe(10);
  });
});

describe('Provider', () => {
  it('should isolate state between different providers', () => {
    const count = state(0);
    const store1 = createStore();
    const store2 = createStore();

    const { result: result1 } = renderHook(() => useState(count), {
      wrapper: createWrapper(store1),
    });

    const { result: result2 } = renderHook(() => useState(count), {
      wrapper: createWrapper(store2),
    });

    act(() => {
      result1.current[1](5);
    });

    expect(result1.current[0]).toBe(5);
    expect(result2.current[0]).toBe(0);
  });

  it('should allow passing a custom store via options', () => {
    const count = state(0);
    const store = createStore();
    store.set(count, 99);

    const { result } = renderHook(
      () => useStateValue(count, { store }),
    );

    expect(result.current).toBe(99);
  });
});

describe('derived read-write state with hooks', () => {
  it('should support custom write through useState', () => {
    const raw = state(0);
    const clamped = state(
      (get) => get(raw),
      (_get, set, value: number) => set(raw, Math.max(0, Math.min(100, value))),
    );
    const store = createStore();

    const { result } = renderHook(() => useState(clamped), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current[1](150);
    });

    expect(result.current[0]).toBe(100);

    act(() => {
      result.current[1](-50);
    });

    expect(result.current[0]).toBe(0);
  });
});

describe('useState signal-style API', () => {
  it('should expose .value for reading', () => {
    const count = state(42);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store),
    });

    expect(result.current.value).toBe(42);
  });

  it('should expose .set() for direct value setting', () => {
    const count = state(0);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.set(123);
    });

    expect(result.current.value).toBe(123);
  });

  it('should expose .update() for function updates', () => {
    const count = state(10);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.update((c) => c + 5);
    });

    expect(result.current.value).toBe(15);
  });

  it('should work with both destructure and signal style', () => {
    const count = state(0);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.set(10);
    });

    expect(result.current[0]).toBe(10);
    expect(result.current.value).toBe(10);

    act(() => {
      result.current[1](20);
    });

    expect(result.current.value).toBe(20);
  });
});
