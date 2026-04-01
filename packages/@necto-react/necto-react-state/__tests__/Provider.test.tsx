import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement } from 'react';

import { state, createStore } from '@necto/state';
import { Provider, useStore } from '../src/components/Provider';
import { useState } from '../src/hooks/useState';

import type { ReactNode } from 'react';
import type { Store } from '@necto/state';

function createWrapper(store: Store) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(Provider, { store }, children);
  };
}

describe('Provider', () => {
  it('should isolate state between different providers', () => {
    const count = state(0);
    const store1 = createStore();
    const store2 = createStore();

    const { result: result1 } = renderHook(() => useState(count), {
      wrapper: createWrapper(store1)
    });

    const { result: result2 } = renderHook(() => useState(count), {
      wrapper: createWrapper(store2)
    });

    act(() => {
      result1.current[1](5);
    });

    expect(result1.current[0]).toBe(5);
    expect(result2.current[0]).toBe(0);
  });

  it('should create a store automatically when none provided', () => {
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(Provider, {}, children);

    const { result } = renderHook(() => useStore(), { wrapper });

    expect(result.current).toBeDefined();
  });
});

describe('useStore', () => {
  it('should return the store from context', () => {
    const store = createStore();

    const { result } = renderHook(() => useStore(), {
      wrapper: createWrapper(store)
    });

    expect(result.current).toBe(store);
  });

  it('should prefer explicit store option over context', () => {
    const contextStore = createStore();
    const explicitStore = createStore();

    const { result } = renderHook(
      () => useStore({ store: explicitStore }),
      { wrapper: createWrapper(contextStore) }
    );

    expect(result.current).toBe(explicitStore);
  });

  it('should fall back to default store when no context or option', () => {
    const { result } = renderHook(() => useStore());

    expect(result.current).toBeDefined();
  });
});
