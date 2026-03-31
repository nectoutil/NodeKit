/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useMemo } from 'react';
import { state } from '@necto/state';

import { useState } from '../useState';

import type { SetStateAction, PrimitiveState } from '@necto/state';
import type {
  UseLocalStateOptions,
  LocalStateResult
} from './useLocalState.types';

/** useLocalState(initialValue) — component-scoped state, drop-in for React's useState with signal-style API */
export function useLocalState<Value>(
  initialValue: Value,
  options?: UseLocalStateOptions
): LocalStateResult<Value>;

/** useLocalState(initializer) — component-scoped state with lazy initializer */
export function useLocalState<Value>(
  initializer: () => Value,
  options?: UseLocalStateOptions
): LocalStateResult<Value>;

export function useLocalState<Value>(
  initialValue: Value | (() => Value),
  options?: UseLocalStateOptions
) {
  const initialRef = useRef<Value>(null);
  const stateRef = useRef<PrimitiveState<Value>>(null);

  if (stateRef.current === null) {
    const resolved =
      typeof initialValue === 'function'
        ? (initialValue as () => Value)()
        : initialValue;
    initialRef.current = resolved;
    stateRef.current = state(resolved);
  }

  const [value, setter] = useState(stateRef.current, options);

  const result = useMemo(() => {
    const tuple = [value, setter] as unknown as LocalStateResult<Value>;

    Object.defineProperty(tuple, 'value', {
      get: () => tuple[0],
      enumerable: true,
      configurable: true
    });

    tuple.set = (v: Value) => setter(v);
    tuple.update = (fn: (prev: Value) => Value) =>
      setter(fn as SetStateAction<Value>);
    tuple.reset = () => setter(initialRef.current as SetStateAction<Value>);

    return tuple;
  }, [value, setter]);

  return result;
}
