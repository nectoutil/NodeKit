/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createResizeObserver } from '@necto/dom';

import { useLatestRef } from '../useLatestRef';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';

import type {
  UseResizeObserverOptions,
  UseResizeObserverCallback
} from './useResizeObserver.types';
import type { ForwardedRef, RefObject } from 'react';
import type {
  ResizeObserverController,
  ResizeObserverHandler
} from '@necto/dom';

let sharedObserver: ResizeObserverController | null = null;

export function useResizeObserver<TElement extends Element>(
  target: RefObject<TElement> | ForwardedRef<TElement> | TElement | null,
  callback: UseResizeObserverCallback,
  options: UseResizeObserverOptions = {}
): ResizeObserverController | null {
  if (
    !sharedObserver &&
    (typeof globalThis.ResizeObserver !== 'undefined' || options.polyfill)
  ) {
    sharedObserver = createResizeObserver(options.polyfill);
  }

  const observer = sharedObserver;
  const latestCallback: RefObject<ResizeObserverHandler> =
    useLatestRef(callback);

  useIsomorphicLayoutEffect(() => {
    if (!observer) {
      return;
    }

    const targetElement: Element | null =
      target && typeof target === 'object' && 'current' in target
        ? (target.current as Element | null)
        : (target as Element | null);

    if (!targetElement) {
      return;
    }

    let isUnsubscribed: boolean = false;

    function handleResize(
      entry: ResizeObserverEntry,
      observerInstance: ResizeObserver
    ): void {
      if (isUnsubscribed) {
        return;
      }

      latestCallback.current(entry, observerInstance);
    }

    observer.subscribe(targetElement, handleResize);

    return (): void => {
      isUnsubscribed = true;
      observer.unsubscribe(targetElement, handleResize);
    };
  }, [target, observer, latestCallback]);

  return observer;
}
