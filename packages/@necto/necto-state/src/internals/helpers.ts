/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { State, WritableState, StateRecord, Mounted } from '../types';

type AnyValue = unknown;
type AnyState = State<AnyValue>;
type AnyWritableState = WritableState<AnyValue, unknown[], unknown>;

export function hasInitialValue<T extends State<AnyValue>>(
  s: T
): s is T & (T extends State<infer Value> ? { init: Value } : never) {
  return 'init' in s;
}

export function isWritableState(s: AnyState): s is AnyWritableState {
  return !!(s as AnyWritableState).write;
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

export function isPromiseLike(p: unknown): p is PromiseLike<unknown> {
  return typeof (p as any)?.then === 'function';
}

export function addPendingPromise(
  s: AnyState,
  promise: PromiseLike<AnyValue>,
  depState: StateRecord
): void {
  if (!depState.pendingPromises.has(s)) {
    depState.pendingPromises.add(s);
    const cleanup = () => depState.pendingPromises.delete(s);
    promise.then(cleanup, cleanup);
  }
}

export function getDependents(
  s: AnyState,
  stateRecord: StateRecord,
  mountedMap: WeakMap<AnyState, Mounted>
): Set<AnyState> {
  const result = new Set<AnyState>();
  for (const a of mountedMap.get(s)?.dependents || []) {
    result.add(a);
  }
  for (const pending of stateRecord.pendingPromises) {
    result.add(pending);
  }
  return result;
}
