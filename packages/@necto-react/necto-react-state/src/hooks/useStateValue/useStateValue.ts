/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDebugValue, useEffect, useReducer } from 'react';

import type { State, ExtractStateValue, Store } from '@necto/state';

import { useStore } from '../../components/Provider';

import type { UseStateValueOptions } from './useStateValue.types';

/** useStateValue(state) — subscribe and return the current value */
export function useStateValue<Value>(
  s: State<Value>,
  options?: UseStateValueOptions
): Awaited<Value>;

export function useStateValue<S extends State<unknown>>(
  s: S,
  options?: UseStateValueOptions
): Awaited<ExtractStateValue<S>>;

export function useStateValue<Value>(
  s: State<Value>,
  options?: UseStateValueOptions
) {
  const store = useStore(options);

  const [[valueFromReducer, storeFromReducer, stateFromReducer], rerender] =
    useReducer<readonly [Value, Store, typeof s], undefined, []>(
      (prev) => {
        const nextValue = store.get(s);
        if (
          Object.is(prev[0], nextValue) &&
          prev[1] === store &&
          prev[2] === s
        ) {
          return prev;
        }
        return [nextValue, store, s];
      },
      undefined,
      () => [store.get(s), store, s]
    );

  let value = valueFromReducer;
  if (storeFromReducer !== store || stateFromReducer !== s) {
    rerender();
    value = store.get(s);
  }

  useEffect(() => {
    const unsub = store.sub(s, () => {
      rerender();
    });
    rerender();
    return unsub;
  }, [store, s]);

  useDebugValue(value);
  return value as Awaited<Value>;
}
