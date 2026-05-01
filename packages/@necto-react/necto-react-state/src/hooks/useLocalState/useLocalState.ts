/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback, useMemo, useRef } from 'react';
import { state } from '@necto/state';

import { useState } from '../useState';

import type {
  LocalStateResult,
  UseLocalStateOptions
} from './useLocalState.types';
import type { RefObject } from 'react';
import type { SetStateAction, PrimitiveState } from '@necto/state';

export function useLocalState<Value>(
  initialValue: Value,
  options?: UseLocalStateOptions
): LocalStateResult<Value>;

export function useLocalState<Value>(
  initializer: () => Value,
  options?: UseLocalStateOptions
): LocalStateResult<Value>;

export function useLocalState<Value>(
  initialValue: Value | (() => Value),
  options?: UseLocalStateOptions
): LocalStateResult<Value> {
  const initialRef: RefObject<Value | null> = useRef<Value>(null);
  const stateRef: RefObject<PrimitiveState<Value> | null> =
    useRef<PrimitiveState<Value>>(null);

  if (stateRef.current === null) {
    const resolved: Value =
      typeof initialValue === 'function'
        ? (initialValue as () => Value)()
        : initialValue;

    initialRef.current = resolved;
    stateRef.current = state(resolved);
  }

  const [value, setValue] = useState(stateRef.current, options);

  // Stable identity across renders so consumers can put `result.reset` in
  // dep arrays without re-running effects. The setter from useState is
  // already stable, so this callback's identity only depends on it.
  const reset = useCallback((): void => {
    setValue(initialRef.current as SetStateAction<Value>);
  }, [setValue]);

  // Functional updater wrapper. Same identity story as `reset`.
  const update = useCallback(
    (updater: (previous: Value) => Value): void => {
      setValue(updater as SetStateAction<Value>);
    },
    [setValue]
  );

  // Build the tuple+signal hybrid once per state change. `Object.assign` on
  // an array gives us the same shape as before (`[value, setValue]`), with
  // signal-style accessors (`value`, `set`, `update`, `reset`) attached so
  // both API styles work on the same result object. Recomputed only when
  // the value or setters change, so identity is stable across no-op renders.
  return useMemo(
    (): LocalStateResult<Value> =>
      Object.assign([value, setValue] as const, {
        value,
        set: setValue,
        update,
        reset
      }) as LocalStateResult<Value>,
    [value, setValue, update, reset]
  );
}
