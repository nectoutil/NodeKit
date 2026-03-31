/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  State,
  WritableState,
  Store,
  StateRecord,
  Mounted,
  EpochNumber
} from '../types';

type AnyValue = unknown;
type AnyState = State<AnyValue>;

export type StoreContext = {
  store: Store;
  stateRecordMap: WeakMap<AnyState, StateRecord>;
  mountedMap: WeakMap<AnyState, Mounted>;
  invalidatedStates: WeakMap<AnyState, EpochNumber>;
  changedStates: Set<AnyState>;
  mountCallbacks: Set<() => void>;
  unmountCallbacks: Set<() => void>;
  abortHandlersMap: WeakMap<PromiseLike<unknown>, Set<() => void>>;
  storeEpoch: number;

  methods: StoreMethods;
};

export type StoreMethods = {
  ensureStateRecord: <Value>(s: State<Value>) => StateRecord<Value>;
  readStateRecord: <Value>(s: State<Value>) => StateRecord<Value>;
  writeStateRecord: <Value, Args extends unknown[], Result>(
    s: WritableState<Value, Args, Result>,
    ...args: Args
  ) => Result;
  setValueOrPromise: <Value>(s: State<Value>, valueOrPromise: Value) => void;
  invalidateDependents: (s: AnyState) => void;
  recomputeInvalidated: () => void;
  flushCallbacks: () => void;
  mountState: <Value>(s: State<Value>) => Mounted;
  unmountState: <Value>(s: State<Value>) => Mounted | undefined;
  mountDependencies: (s: AnyState) => void;
  registerAbortHandler: (
    promise: PromiseLike<unknown>,
    handler: () => void
  ) => void;
  abortPromise: (promise: PromiseLike<unknown>) => void;
};

export function createStoreContext(): StoreContext {
  const ctx = {
    stateRecordMap: new WeakMap(),
    mountedMap: new WeakMap(),
    invalidatedStates: new WeakMap(),
    changedStates: new Set(),
    mountCallbacks: new Set(),
    unmountCallbacks: new Set(),
    abortHandlersMap: new WeakMap(),
    storeEpoch: 0,
    methods: {} as StoreMethods
  } as StoreContext;

  return ctx;
}
