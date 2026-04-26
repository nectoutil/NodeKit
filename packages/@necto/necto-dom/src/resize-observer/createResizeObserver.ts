/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ResizeObserverHandler, ResizeObserverController } from './types';

export function createResizeObserver(
  polyfill?: typeof ResizeObserver
): ResizeObserverController {
  let flushScheduled: boolean = false;
  let pendingEntries: ResizeObserverEntry[] = [];

  const subscribers: Map<Element, Array<ResizeObserverHandler>> = new Map();

  const ResizeObserverImpl = polyfill ?? globalThis.ResizeObserver;

  const observer: ResizeObserver = new ResizeObserverImpl(
    (
      entries: ResizeObserverEntry[],
      observerInstance: ResizeObserver
    ): void => {
      pendingEntries = pendingEntries.concat(entries);

      if (flushScheduled) {
        return;
      }

      flushScheduled = true;

      globalThis.requestAnimationFrame(() => {
        const latestPerTarget: Map<Element, ResizeObserverEntry> = new Map();
        for (const entry of pendingEntries) {
          latestPerTarget.set(entry.target, entry);
        }

        pendingEntries = [];
        flushScheduled = false;

        for (const [target, entry] of latestPerTarget) {
          const handlersForTarget: ResizeObserverHandler[] | undefined =
            subscribers.get(target);

          if (!handlersForTarget) {
            continue;
          }

          for (const handler of handlersForTarget) {
            handler(entry, observerInstance);
          }
        }
      });
    }
  );

  return {
    observer,

    subscribe(target: Element, handler: ResizeObserverHandler): void {
      const existing: ResizeObserverHandler[] | undefined =
        subscribers.get(target);
      if (existing) {
        existing.push(handler);
        return;
      }

      subscribers.set(target, [handler]);
      observer.observe(target);
    },

    unsubscribe(target: Element, handler: ResizeObserverHandler): void {
      const existing: ResizeObserverHandler[] | undefined =
        subscribers.get(target);
      if (!existing) {
        return;
      }

      const handlerIndex: number = existing.indexOf(handler);
      if (handlerIndex === -1) {
        return;
      }

      existing.splice(handlerIndex, 1);

      if (existing.length === 0) {
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
