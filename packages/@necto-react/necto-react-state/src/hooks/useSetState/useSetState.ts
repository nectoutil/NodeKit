/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback } from 'react';

import type {
  WritableState,
  ExtractStateArgs,
  ExtractStateResult
} from '@necto/state';

import { useStore } from '../../components/Provider';

import type { SetState, UseSetStateOptions } from './useSetState.types';

/** useSetState(state) — returns a stable setter function */
export function useSetState<Value, Args extends unknown[], Result>(
  s: WritableState<Value, Args, Result>,
  options?: UseSetStateOptions
): SetState<Args, Result>;

export function useSetState<S extends WritableState<unknown, never[], unknown>>(
  s: S,
  options?: UseSetStateOptions
): SetState<ExtractStateArgs<S>, ExtractStateResult<S>>;

export function useSetState<Value, Args extends unknown[], Result>(
  s: WritableState<Value, Args, Result>,
  options?: UseSetStateOptions
) {
  const store = useStore(options);
  const setState = useCallback(
    (...args: Args) => {
      if (!('write' in s)) {
        throw new Error('state is not writable');
      }
      return store.set(s, ...args);
    },
    [store, s]
  );
  return setState;
}
