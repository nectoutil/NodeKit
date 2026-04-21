/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any is required for generic state handling.
// biome-ignore-all lint/style/noNonNullAssertion: Non-null assertions are intentional in state internals.

import { isWritableState } from './helpers';

import type { StoreContext } from './context';
import type { State, Mounted } from '../types';

type AnyValue = unknown;
type AnyState = State<AnyValue>;

export function flushCallbacks(ctx: StoreContext): void {
  const errors: unknown[] = [];
  const call = (fn: () => void) => {
    try {
      fn();
    } catch (e) {
      errors.push(e);
    }
  };

  do {
    const callbacks = new Set<() => void>();
    const add = callbacks.add.bind(callbacks);

    // biome-ignore lint/suspicious/useIterableCallbackReturn: Implicit void return is intentional and harmless here.
    [...ctx.changedStates].forEach((s) =>
      ctx.mountedMap.get(s)?.listeners.forEach(add)
    );
    ctx.changedStates.clear();

    [...ctx.unmountCallbacks, ...ctx.mountCallbacks].forEach(add);
    // biome-ignore lint/suspicious/useIterableCallbackReturn: Implicit void return is intentional and harmless here.
    [ctx.unmountCallbacks, ctx.mountCallbacks].forEach((c) => c.clear());

    if (ctx.changedStates.size) {
      ctx.methods.recomputeInvalidated();
    }
  } while (
    ctx.changedStates.size ||
    ctx.unmountCallbacks.size ||
    ctx.mountCallbacks.size
  );

  if (errors.length) {
    throw new AggregateError(errors);
  }
}

export function mountDependencies(ctx: StoreContext, s: AnyState): void {
  const stateRecord = ctx.methods.ensureStateRecord(s);
  const mounted = ctx.mountedMap.get(s);

  if (mounted) {
    for (const [a, epoch] of stateRecord.dependencies) {
      if (!mounted.dependencies.has(a)) {
        const aState = ctx.methods.ensureStateRecord(a);
        const aMounted = ctx.methods.mountState(a);

        aMounted.dependents.add(s);
        mounted.dependencies.add(a);

        if (epoch !== aState.epoch) {
          ctx.changedStates.add(a);
          ctx.methods.invalidateDependents(a);
        }
      }
    }
    for (const a of mounted.dependencies) {
      if (!stateRecord.dependencies.has(a)) {
        mounted.dependencies.delete(a);
        const aMounted = ctx.methods.unmountState(a);
        aMounted?.dependents.delete(s);
      }
    }
  }
}

export function mountState<Value>(ctx: StoreContext, s: State<Value>): Mounted {
  const stateRecord = ctx.methods.ensureStateRecord(s);
  let mounted = ctx.mountedMap.get(s);

  if (!mounted) {
    ctx.methods.readStateRecord(s);
    for (const a of stateRecord.dependencies.keys()) {
      const aMounted = ctx.methods.mountState(a);
      aMounted.dependents.add(s);
    }

    mounted = {
      listeners: new Set(),
      dependencies: new Set(stateRecord.dependencies.keys()),
      dependents: new Set()
    };

    ctx.mountedMap.set(s, mounted);

    if (isWritableState(s)) {
      const processOnMount = () => {
        let isSync = true;
        const setState = (...args: unknown[]) => {
          try {
            return ctx.methods.writeStateRecord(s, ...args);
          } finally {
            if (!isSync) {
              ctx.methods.recomputeInvalidated();
              ctx.methods.flushCallbacks();
            }
          }
        };

        try {
          const onUnmount = s.onMount?.(setState as any);
          if (onUnmount) {
            mounted!.unmount = () => {
              isSync = true;

              try {
                onUnmount();
              } finally {
                isSync = false;
              }
            };
          }
        } finally {
          isSync = false;
        }
      };

      ctx.mountCallbacks.add(processOnMount);
    }
  }

  return mounted;
}

export function unmountState<Value>(
  ctx: StoreContext,
  state: State<Value>
): Mounted | undefined {
  const stateRecord = ctx.methods.ensureStateRecord(state);
  let mounted = ctx.mountedMap.get(state);

  if (!mounted || mounted.listeners.size) {
    return mounted;
  }

  let isDependent = false;
  for (const a of mounted.dependents) {
    if (ctx.mountedMap.get(a)?.dependencies.has(state)) {
      isDependent = true;
      break;
    }
  }

  if (!isDependent) {
    if (mounted.unmount) {
      ctx.unmountCallbacks.add(mounted.unmount);
    }

    mounted = undefined;
    ctx.mountedMap.delete(state);
    for (const a of stateRecord.dependencies.keys()) {
      const aMounted = ctx.methods.unmountState(a);
      aMounted?.dependents.delete(state);
    }

    return undefined;
  }

  return mounted;
}
