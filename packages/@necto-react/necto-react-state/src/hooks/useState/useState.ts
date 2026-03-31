/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from 'react';

import type {
  State,
  WritableState,
  PrimitiveState,
  SetStateAction
} from '@necto/state';

import { useStateValue } from '../useStateValue';
import { useSetState } from '../useSetState';

import type { UseStateOptions, StateResult } from './useState.types';

/** useState(writableState) — returns [value, setter] with signal-style API */
export function useState<Value>(
  s: PrimitiveState<Value>,
  options?: UseStateOptions
): StateResult<Value>;

export function useState<Value>(
  s: PrimitiveState<Value> | State<Value>,
  options?: UseStateOptions
) {
  const value = useStateValue(s, options);
  const setter = useSetState(
    s as WritableState<Value, [SetStateAction<Value>], void>,
    options
  );

  const result = useMemo(() => {
    const tuple = [value, setter] as unknown as StateResult<Value>;

    Object.defineProperty(tuple, 'value', {
      get: () => tuple[0],
      enumerable: true,
      configurable: true
    });

    tuple.set = (v: Value) => setter(v);
    tuple.update = (fn: (prev: Value) => Value) =>
      setter(fn as SetStateAction<Value>);

    return tuple;
  }, [value, setter]);

  return result;
}
