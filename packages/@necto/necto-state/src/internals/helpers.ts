/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/style/noNonNullAssertion: Non-null assertions are intentional in state internals.
// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any is required for generic state handling.

import type { State, WritableState, StateRecord, Mounted } from '../types';

type AnyValue = unknown;
type AnyState = State<AnyValue>;
type AnyWritableState = WritableState<AnyValue, unknown[], unknown>;

export function hasInitialValue<T extends State<AnyValue>>(
  state: T
): state is T & (T extends State<infer Value> ? { init: Value } : never) {
  return 'init' in state;
}

export function isWritableState(state: AnyState): state is AnyWritableState {
  return !!(state as AnyWritableState).write;
}

export function isInitialized<Value>(stateRecord: StateRecord<Value>): boolean {
  return 'value' in stateRecord || 'error' in stateRecord;
}

export function unwrapValue<Value>(stateRecord: StateRecord<Value>): Value {
  if ('error' in stateRecord) {
    throw stateRecord.error;
  }

  return stateRecord.value!;
}

export function isPromiseLike(
  promise: unknown
): promise is PromiseLike<unknown> {
  return typeof (promise as any)?.then === 'function';
}

export function addPendingPromise(
  state: AnyState,
  promise: PromiseLike<AnyValue>,
  depState: StateRecord
): void {
  if (!depState.pendingPromises.has(state)) {
    depState.pendingPromises.add(state);
    const cleanup = () => depState.pendingPromises.delete(state);
    promise.then(cleanup, cleanup);
  }
}

export function getDependents(
  state: AnyState,
  stateRecord: StateRecord,
  mountedMap: WeakMap<AnyState, Mounted>
): Set<AnyState> {
  const result = new Set<AnyState>();
  for (const dep of mountedMap.get(state)?.dependents || []) {
    result.add(dep);
  }

  for (const pending of stateRecord.pendingPromises) {
    result.add(pending);
  }

  return result;
}
