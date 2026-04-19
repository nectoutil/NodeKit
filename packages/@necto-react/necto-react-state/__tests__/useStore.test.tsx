import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, getDefaultStore } from '@necto/state';

import { useStore } from '../src/hooks/useStore';
import { Provider } from '../src/components/Provider';

import type { ReactNode } from 'react';
import type { Store } from '@necto/state';

function createWrapper(store: Store) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(Provider, { store }, children);
  };
}

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

    expect(result.current).toBe(getDefaultStore());
  });

  it('should return the same default store across multiple calls', () => {
    const { result: result1 } = renderHook(() => useStore());
    const { result: result2 } = renderHook(() => useStore());

    expect(result1.current).toBe(result2.current);
  });

  it('should return a different store per provider', () => {
    const store1 = createStore();
    const store2 = createStore();

    const { result: result1 } = renderHook(() => useStore(), {
      wrapper: createWrapper(store1)
    });

    const { result: result2 } = renderHook(() => useStore(), {
      wrapper: createWrapper(store2)
    });

    expect(result1.current).toBe(store1);
    expect(result2.current).toBe(store2);
    expect(result1.current).not.toBe(result2.current);
  });
});
