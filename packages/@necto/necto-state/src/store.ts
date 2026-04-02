/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any is required for generic state handling.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Store } from './types';
import { createStoreContext } from './internals/context';
import { unwrapValue } from './internals/helpers';
import { registerAbortHandler, abortPromise } from './internals/abort';
import {
  ensureStateRecord,
  readStateRecord,
  recomputeInvalidated
} from './internals/read';
import {
  writeStateRecord,
  setValueOrPromise,
  invalidateDependents
} from './internals/write';
import {
  flushCallbacks,
  mountState,
  unmountState,
  mountDependencies
} from './internals/mount';

export function createStore(): Store {
  const ctx = createStoreContext();

  ctx.methods = {
    ensureStateRecord: (s) => ensureStateRecord(ctx, s),
    readStateRecord: (s) => readStateRecord(ctx, s),
    writeStateRecord: (s, ...args) => writeStateRecord(ctx, s, ...args),
    setValueOrPromise: (s, v) => setValueOrPromise(ctx, s, v),
    invalidateDependents: (s) => invalidateDependents(ctx, s),
    recomputeInvalidated: () => recomputeInvalidated(ctx),
    flushCallbacks: () => flushCallbacks(ctx),
    mountState: (s) => mountState(ctx, s),
    unmountState: (s) => unmountState(ctx, s),
    mountDependencies: (s) => mountDependencies(ctx, s),
    registerAbortHandler: (p, h) => registerAbortHandler(ctx, p, h),
    abortPromise: (p) => abortPromise(ctx, p)
  };

  const store: Store = {
    get(s) {
      return unwrapValue(ctx.methods.readStateRecord(s));
    },
    set(s, ...args) {
      const prevSize = ctx.changedStates.size;
      try {
        return ctx.methods.writeStateRecord(s, ...args) as any;
      } finally {
        if (ctx.changedStates.size !== prevSize) {
          ctx.methods.recomputeInvalidated();
          ctx.methods.flushCallbacks();
        }
      }
    },
    sub(s, listener) {
      const mounted = ctx.methods.mountState(s);
      mounted.listeners.add(listener);
      ctx.methods.flushCallbacks();
      return () => {
        mounted.listeners.delete(listener);
        ctx.methods.unmountState(s);
        ctx.methods.flushCallbacks();
      };
    }
  };

  ctx.store = store;
  return store;
}

let defaultStore: Store | undefined;

export function getDefaultStore(): Store {
  if (!defaultStore) {
    defaultStore = createStore();
  }
  return defaultStore;
}
