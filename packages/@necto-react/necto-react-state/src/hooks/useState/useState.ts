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

import type { SetState } from '../useSetState/useSetState.types';
import type { UseStateOptions, StateResult } from './useState.types';

/** useState(writableState) — returns [value, setter] with signal-style API */
export function useState<Value>(
  state: PrimitiveState<Value>,
  options?: UseStateOptions
): StateResult<Value>;

export function useState<Value>(
  state: PrimitiveState<Value> | State<Value>,
  options?: UseStateOptions
): StateResult<Value> {
  const value = useStateValue(state, options) as Awaited<Value>;
  const setter = useSetState(
    state as WritableState<Value, [SetStateAction<Value>], void>,
    options
  );

  const result: StateResult<Value> = useMemo((): StateResult<Value> => {
    const tuple = [value, setter] as unknown as StateResult<Value>;

    Object.defineProperties(tuple, {
      value: {
        get(this: [Awaited<Value>, unknown]): Awaited<Value> {
          return this[0];
        },
        enumerable: true,
        configurable: true
      },
      set: {
        value: (value: Value): void => setter(value),
        writable: true,
        configurable: true,
        enumerable: false
      },
      update: {
        value: (func: (prev: Value) => Value): void => setter(func),
        writable: true,
        enumerable: false,
        configurable: true
      }
    });

    return tuple;
  }, [setter]);

  result[0] = value;

  return result;
}
