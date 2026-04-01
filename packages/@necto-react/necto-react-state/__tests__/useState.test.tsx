import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement } from 'react';

import { state, createStore } from '@necto/state';
import { useState } from '../src/hooks/useState';
import { Provider } from '../src/components/Provider';

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
      wrapper: createWrapper(store)
    });

    expect(result.current[0]).toBe(0);
    expect(typeof result.current[1]).toBe('function');
  });

  it('should update when state changes', () => {
    const count = state(0);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store)
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
      wrapper: createWrapper(store)
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
      { wrapper: createWrapper(store) }
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
      wrapper: createWrapper(store)
    });

    act(() => {
      store.set(count, 42);
    });

    expect(result.current[0]).toBe(42);
  });

  it('should support custom write through derived state', () => {
    const raw = state(0);
    const clamped = state(
      (get) => get(raw),
      (_get, set, value: number) => set(raw, Math.max(0, Math.min(100, value)))
    );
    const store = createStore();

    const { result } = renderHook(() => useState(clamped), {
      wrapper: createWrapper(store)
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
      wrapper: createWrapper(store)
    });

    expect(result.current.value).toBe(42);
  });

  it('should expose .set() for direct value setting', () => {
    const count = state(0);
    const store = createStore();

    const { result } = renderHook(() => useState(count), {
      wrapper: createWrapper(store)
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
      wrapper: createWrapper(store)
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
      wrapper: createWrapper(store)
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
