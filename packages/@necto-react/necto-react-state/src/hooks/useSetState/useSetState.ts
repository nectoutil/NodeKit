/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback } from 'react';

import { useStore } from '../useStore';

import type {
  WritableState,
  ExtractStateArgs,
  ExtractStateResult
} from '@necto/state';
import type { SetState, UseSetStateOptions } from './useSetState.types';

export function useSetState<Value, Args extends unknown[], Result>(
  state: WritableState<Value, Args, Result>,
  options?: UseSetStateOptions
): SetState<Args, Result>;

export function useSetState<S extends WritableState<unknown, never[], unknown>>(
  state: S,
  options?: UseSetStateOptions
): SetState<ExtractStateArgs<S>, ExtractStateResult<S>>;

export function useSetState<Value, Args extends unknown[], Result>(
  state: WritableState<Value, Args, Result>,
  options?: UseSetStateOptions
) {
  const store = useStore(options);

  return useCallback(
    (...args: Args) => {
      if (!('write' in state)) throw new Error('state is not writable');

      return store.set(state, ...args);
    },
    [store, state]
  );
}
