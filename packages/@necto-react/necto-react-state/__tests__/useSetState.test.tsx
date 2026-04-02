/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement } from 'react';

import { state, createStore } from '@necto/state';
import { useSetState } from '../src/hooks/useSetState';
import { Provider } from '../src/components/Provider';

import type { ReactNode } from 'react';
import type { Store } from '@necto/state';

function createWrapper(store: Store) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(Provider, { store }, children);
  };
}

describe('useSetState', () => {
  it('should return a stable setter function', () => {
    const count = state(0);
    const store = createStore();

    const { result, rerender } = renderHook(() => useSetState(count), {
      wrapper: createWrapper(store)
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
      wrapper: createWrapper(store)
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
      wrapper: createWrapper(store)
    });

    act(() => {
      result.current((prev) => prev * 2);
    });

    expect(store.get(count)).toBe(10);
  });
});
