/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/style/noNonNullAssertion: Non-null assertions are intentional in state internals.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { State, WritableState } from '../types';
import type { StoreContext } from './context';
import {
  hasInitialValue,
  unwrapValue,
  isPromiseLike,
  addPendingPromise,
  getDependents
} from './helpers';

type AnyValue = unknown;
type AnyState = State<AnyValue>;
type AnyWritableState = WritableState<AnyValue, unknown[], unknown>;
type Getter = Parameters<AnyState['read']>[0];
type Setter = Parameters<AnyWritableState['write']>[1];

export function writeStateRecord<Value, Args extends unknown[], Result>(
  ctx: StoreContext,
  s: WritableState<Value, Args, Result>,
  ...args: Args
): Result {
  let isSync = true;

  const getter: Getter = <V>(a: State<V>) =>
    unwrapValue(ctx.methods.readStateRecord(a));

  const setter: Setter = <V, As extends unknown[], R>(
    a: WritableState<V, As, R>,
    ...setterArgs: As
  ) => {
    const aState = ctx.methods.ensureStateRecord(a);
    try {
      if (a === (s as AnyState)) {
        if (!hasInitialValue(a)) {
          throw new Error('state not writable');
        }
        const prevEpoch = aState.epoch;
        const v = setterArgs[0] as V;
        ctx.methods.setValueOrPromise(a, v);
        ctx.methods.mountDependencies(a);
        if (prevEpoch !== aState.epoch) {
          ++ctx.storeEpoch;
          ctx.changedStates.add(a);
          ctx.methods.invalidateDependents(a);
        }
        return undefined as R;
      } else {
        return ctx.methods.writeStateRecord(a, ...setterArgs);
      }
    } finally {
      if (!isSync) {
        ctx.methods.recomputeInvalidated();
        ctx.methods.flushCallbacks();
      }
    }
  };

  try {
    return s.write(getter, setter, ...args);
  } finally {
    isSync = false;
  }
}

export function setValueOrPromise<Value>(
  ctx: StoreContext,
  s: State<Value>,
  valueOrPromise: Value
): void {
  const stateRecord = ctx.methods.ensureStateRecord(s);
  const hasPrevValue = 'value' in stateRecord;
  const prevValue = stateRecord.value;
  if (isPromiseLike(valueOrPromise)) {
    for (const a of stateRecord.dependencies.keys()) {
      addPendingPromise(s, valueOrPromise, ctx.methods.ensureStateRecord(a));
    }
  }
  stateRecord.value = valueOrPromise;
  delete stateRecord.error;
  if (!hasPrevValue || !Object.is(prevValue, stateRecord.value)) {
    ++stateRecord.epoch;
    if (isPromiseLike(prevValue)) {
      ctx.methods.abortPromise(prevValue);
    }
  }
}

export function invalidateDependents(ctx: StoreContext, s: AnyState): void {
  const stack: AnyState[] = [s];
  while (stack.length) {
    const a = stack.pop()!;
    const aState = ctx.methods.ensureStateRecord(a);
    for (const dep of getDependents(a, aState, ctx.mountedMap)) {
      const depState = ctx.methods.ensureStateRecord(dep);
      if (ctx.invalidatedStates.get(dep) !== depState.epoch) {
        ctx.invalidatedStates.set(dep, depState.epoch);
        stack.push(dep);
      }
    }
  }
}
