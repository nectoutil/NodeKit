/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ResizeObserverController, ResizeObserverHandler } from './types/resize-observer';

export function createResizeObserver(polyfill?: typeof ResizeObserver): ResizeObserverController {
  let flushScheduled: boolean = false;
  let pendingEntries: ResizeObserverEntry[] = [];

  const subscribers: Map<Element, Array<ResizeObserverHandler>> = new Map();
  const ResizeObserverImpl = polyfill ?? globalThis.ResizeObserver;

  const observer: ResizeObserver = new ResizeObserverImpl(
    (entries: ResizeObserverEntry[], observerInstance: ResizeObserver): void => {
      pendingEntries = pendingEntries.concat(entries);

      if (flushScheduled) return;

      flushScheduled = true;

      globalThis.requestAnimationFrame(() => {
        const latestPerTarget: Map<Element, ResizeObserverEntry> = new Map();

        for (const entry of pendingEntries) {
          latestPerTarget.set(entry.target, entry);
        }

        pendingEntries = [];
        flushScheduled = false;

        for (const [target, entry] of latestPerTarget) {
          const handlers = subscribers.get(target);

          if (!handlers) continue;

          for (const handler of handlers) {
            handler(entry, observerInstance);
          }
        }
      });
    }
  );

  return {
    observer,
    subscribe(target, handler): void {
      const handlers = subscribers.get(target);

      if (handlers) {
        handlers.push(handler);
        return;
      }

      subscribers.set(target, [handler]);
      observer.observe(target);
    },
    unsubscribe(target, handler): void {
      const handlers = subscribers.get(target);
      if (!handlers) return;

      const handlerIndex = handlers.indexOf(handler);
      if (handlerIndex === -1) return;

      handlers.splice(handlerIndex, 1);

      if (handlers.length === 0) {
        subscribers.delete(target);
        observer.unobserve(target);
      }
    },
    disconnect(): void {
      observer.disconnect();
      subscribers.clear();
      pendingEntries = [];
      flushScheduled = false;
    }
  };
}
