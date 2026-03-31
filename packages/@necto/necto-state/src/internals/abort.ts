/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { StoreContext } from './context';

export function registerAbortHandler(
  ctx: StoreContext,
  promise: PromiseLike<unknown>,
  handler: () => void
): void {
  let handlers = ctx.abortHandlersMap.get(promise);
  if (!handlers) {
    handlers = new Set();
    ctx.abortHandlersMap.set(promise, handlers);
    const cleanup = () => ctx.abortHandlersMap.delete(promise);
    promise.then(cleanup, cleanup);
  }
  handlers.add(handler);
}

export function abortPromise(
  ctx: StoreContext,
  promise: PromiseLike<unknown>
): void {
  ctx.abortHandlersMap.get(promise)?.forEach((fn) => fn());
}
