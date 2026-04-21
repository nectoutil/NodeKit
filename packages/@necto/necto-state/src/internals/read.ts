/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/style/noNonNullAssertion: Non-null assertions are intentional in state internals.

import {
  unwrapValue,
  isPromiseLike,
  getDependents,
  isInitialized,
  hasInitialValue,
  isWritableState,
  addPendingPromise
} from './helpers';

import type { StoreContext } from './context';
import type { State, StateRecord, EpochNumber } from '../types';

type AnyValue = unknown;
type AnyState = State<AnyValue>;

export function ensureStateRecord<Value>(
  ctx: StoreContext,
  state: State<Value>
): StateRecord<Value> {
  let stateRecord = ctx.stateRecordMap.get(state);
  if (!stateRecord) {
    stateRecord = {
      dependencies: new Map(),
      pendingPromises: new Set(),
      epoch: 0
    };

    ctx.stateRecordMap.set(state, stateRecord);
    state.INTERNAL_onInit?.(ctx.store);
  }

  return stateRecord as StateRecord<Value>;
}

export function readStateRecord<Value>(
  ctx: StoreContext,
  state: State<Value>
): StateRecord<Value> {
  const stateRecord = ctx.methods.ensureStateRecord(state);

  if (isInitialized(stateRecord)) {
    if (
      (ctx.mountedMap.has(state) &&
        ctx.invalidatedStates.get(state) !== stateRecord.epoch) ||
      stateRecord.validatedEpoch === ctx.storeEpoch
    ) {
      stateRecord.validatedEpoch = ctx.storeEpoch;
      return stateRecord;
    }

    let hasChangedDeps = false;
    for (const [a, epoch] of stateRecord.dependencies) {
      if (ctx.methods.readStateRecord(a).epoch !== epoch) {
        hasChangedDeps = true;
        break;
      }
    }

    if (!hasChangedDeps) {
      stateRecord.validatedEpoch = ctx.storeEpoch;
      return stateRecord;
    }
  }

  let isSync: boolean = true;
  const prevDeps = new Set<AnyState>(stateRecord.dependencies.keys());
  const nextDeps = new Map<AnyState, EpochNumber>();

  const pruneDeps = () => {
    for (const a of prevDeps) {
      if (!nextDeps.has(a)) {
        stateRecord.dependencies.delete(a);
      }
    }
  };

  const mountDepsIfAsync = () => {
    if (ctx.mountedMap.has(state)) {
      const shouldRecompute = !ctx.changedStates.size;
      ctx.methods.mountDependencies(state);

      if (shouldRecompute) {
        ctx.methods.recomputeInvalidated();
        ctx.methods.flushCallbacks();
      }
    }
  };

  const getter = <V>(a: State<V>) => {
    if (a === (state as AnyState)) {
      const aState = ctx.methods.ensureStateRecord(a);
      if (!isInitialized(aState)) {
        if (hasInitialValue(a)) {
          ctx.methods.setValueOrPromise(a, a.init);
        } else {
          throw new Error('no state init');
        }
      }

      return unwrapValue(aState);
    }

    const aState = ctx.methods.readStateRecord(a);
    try {
      return unwrapValue(aState);
    } finally {
      nextDeps.set(a, aState.epoch);
      stateRecord.dependencies.set(a, aState.epoch);

      if (isPromiseLike(stateRecord.value)) {
        addPendingPromise(state, stateRecord.value, aState);
      }

      if (ctx.mountedMap.has(state)) {
        ctx.mountedMap.get(a)?.dependents.add(state);
      }

      if (!isSync) {
        mountDepsIfAsync();
      }
    }
  };

  let controller: AbortController | undefined;
  let setSelf: ((...args: unknown[]) => unknown) | undefined;
  const options = {
    get signal() {
      if (!controller) {
        controller = new AbortController();
      }

      return controller.signal;
    },
    get setSelf() {
      if (!setSelf && isWritableState(state)) {
        setSelf = (...args) => {
          if (!isSync) {
            try {
              return ctx.methods.writeStateRecord(state, ...args);
            } finally {
              ctx.methods.recomputeInvalidated();
              ctx.methods.flushCallbacks();
            }
          }
        };
      }

      return setSelf;
    }
  };

  const prevEpoch = stateRecord.epoch;
  const prevInvalidated = ctx.invalidatedStates.get(state) === prevEpoch;

  try {
    const valueOrPromise = state.read(getter, options as never);
    ctx.methods.setValueOrPromise(state, valueOrPromise);
    if (isPromiseLike(valueOrPromise)) {
      ctx.methods.registerAbortHandler(valueOrPromise, () =>
        controller?.abort()
      );

      const settle = () => {
        pruneDeps();
        mountDepsIfAsync();
      };
      valueOrPromise.then(settle, settle);
    } else {
      pruneDeps();
    }

    stateRecord.validatedEpoch = ctx.storeEpoch;

    return stateRecord;
  } catch (error) {
    delete stateRecord.value;

    stateRecord.error = error;
    stateRecord.epoch++;
    stateRecord.validatedEpoch = ctx.storeEpoch;

    return stateRecord;
  } finally {
    isSync = false;
    if (stateRecord.epoch !== prevEpoch && prevInvalidated) {
      ctx.invalidatedStates.set(state, stateRecord.epoch);
      ctx.changedStates.add(state);
    }
  }
}

export function recomputeInvalidated(ctx: StoreContext): void {
  const topSorted: [AnyState, StateRecord][] = [];
  const visiting = new WeakSet<AnyState>();
  const visited = new WeakSet<AnyState>();
  const stack: AnyState[] = Array.from(ctx.changedStates);

  while (stack.length) {
    const a = stack[stack.length - 1]!;
    const aState = ctx.methods.ensureStateRecord(a);

    if (visited.has(a)) {
      stack.pop();
      continue;
    }

    if (visiting.has(a)) {
      if (ctx.invalidatedStates.get(a) === aState.epoch) {
        topSorted.push([a, aState]);
      }

      visited.add(a);
      stack.pop();
      continue;
    }

    visiting.add(a);

    for (const dep of getDependents(a, aState, ctx.mountedMap)) {
      if (!visiting.has(dep)) {
        stack.push(dep);
      }
    }
  }

  for (let i: number = topSorted.length - 1; i >= 0; --i) {
    const [a, aState] = topSorted[i]!;
    let hasChangedDeps = false;

    for (const dep of aState.dependencies.keys()) {
      if (dep !== a && ctx.changedStates.has(dep)) {
        hasChangedDeps = true;
        break;
      }
    }

    if (hasChangedDeps) {
      ctx.invalidatedStates.set(a, aState.epoch);
      ctx.methods.readStateRecord(a);
      ctx.methods.mountDependencies(a);
    }

    ctx.invalidatedStates.delete(a);
  }
}
