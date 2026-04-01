import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement } from 'react';

import { state, createStore } from '@necto/state';
import { useStateValue } from '../src/hooks/useStateValue';
import { Provider } from '../src/components/Provider';

import type { ReactNode } from 'react';
import type { Store } from '@necto/state';

function createWrapper(store: Store) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(Provider, { store }, children);
  };
}

describe('useStateValue', () => {
  it('should return the current value', () => {
    const name = state('hello');
    const store = createStore();

    const { result } = renderHook(() => useStateValue(name), {
      wrapper: createWrapper(store)
    });

    expect(result.current).toBe('hello');
  });

  it('should update when dependency changes', () => {
    const count = state(2);
    const doubled = state((get) => get(count) * 2);
    const store = createStore();

    const { result } = renderHook(() => useStateValue(doubled), {
      wrapper: createWrapper(store)
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
      wrapper: createWrapper(store)
    });

    expect(result.current).toBe('John Doe');

    act(() => {
      store.set(firstName, 'Jane');
    });

    expect(result.current).toBe('Jane Doe');
  });

  it('should accept a custom store via options', () => {
    const count = state(0);
    const store = createStore();
    store.set(count, 99);

    const { result } = renderHook(() => useStateValue(count, { store }));

    expect(result.current).toBe(99);
  });
});
