/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDebugValue, useEffect, useReducer } from 'react';

import { useStore } from '../useStore';

import type { UseStateValueOptions } from './useStateValue.types';
import type { State, ExtractStateValue, Store } from '@necto/state';

export function useStateValue<Value>(
  state: State<Value>,
  options?: UseStateValueOptions
): Awaited<Value>;

export function useStateValue<S extends State<unknown>>(
  state: S,
  options?: UseStateValueOptions
): Awaited<ExtractStateValue<S>>;

export function useStateValue<Value>(
  state: State<Value>,
  options?: UseStateValueOptions
): Awaited<Value> {
  const store = useStore(options);

  const [[valueFromReducer, storeFromReducer, stateFromReducer], rerender] =
    useReducer<readonly [Value, Store, typeof state], undefined, []>(
      (prev) => {
        const nextValue = store.get(state);
        if (
          Object.is(prev[0], nextValue) &&
          prev[1] === store &&
          prev[2] === state
        ) {
          return prev;
        }
        return [nextValue, store, state];
      },
      undefined,
      () => [store.get(state), store, state]
    );

  let value = valueFromReducer;
  if (storeFromReducer !== store || stateFromReducer !== state) {
    rerender();
    value = store.get(state);
  }

  useEffect(() => {
    const unsub = store.sub(state, () => {
      rerender();
    });

    rerender();
    return unsub;
  }, [store, state]);

  useDebugValue(value);

  return value as Awaited<Value>;
}
