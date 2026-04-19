/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef } from 'react';
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

  const result = useState(stateRef.current, options) as LocalStateResult<Value>;

  Object.defineProperty(result, 'reset', {
    value: (): void => result[1](initialRef.current as SetStateAction<Value>),
    writable: true,
    enumerable: false,
    configurable: true
  });

  return result;
}
