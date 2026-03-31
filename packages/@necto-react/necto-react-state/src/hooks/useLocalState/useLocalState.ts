/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef } from 'react';
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

  const result = useState(stateRef.current, options) as LocalStateResult<Value>;

  result.reset = () => result[1](initialRef.current as SetStateAction<Value>);

  return result;
}
