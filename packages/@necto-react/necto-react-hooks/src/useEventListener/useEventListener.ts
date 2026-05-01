/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';

import { useLatestRef } from '../useLatestRef';

import type {
  EventMapOf,
  EventListenerTarget,
  UseEventListenerOptions
} from './useEventListener.types';
import type { RefObject } from 'react';

export function useEventListener<
  T extends EventListenerTarget = Window,
  K extends keyof EventMapOf<T> = keyof EventMapOf<T>
>(
  eventName: K,
  handler: (event: EventMapOf<T>[K]) => void,
  element?: RefObject<T | null>,
  options?: UseEventListenerOptions
): void {
  const { enabled = true } = options ?? {};

  const handlerRef: RefObject<typeof handler> = useLatestRef(handler);

  useEffect((): (() => void) | undefined => {
    if (!enabled) {
      return undefined;
    }

    const target: EventListenerTarget = element?.current ?? window;
    if (!target?.addEventListener) {
      return undefined;
    }

    const listener = (event: Event): void => {
      handlerRef.current(event as EventMapOf<T>[K]);
    };

    target.addEventListener(eventName as string, listener, options);

    return (): void => {
      target.removeEventListener(eventName as string, listener, options);
    };
  }, [enabled, eventName, element, options, handlerRef]);
}
