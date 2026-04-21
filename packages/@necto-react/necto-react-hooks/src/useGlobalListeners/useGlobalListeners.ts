/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useCallback, useEffect } from 'react';

import type { UseGlobalListenersReturn } from './useGlobalListeners.types';

export function useGlobalListeners(): UseGlobalListenersReturn {
  const globalListeners = useRef<
    Map<
      EventListenerOrEventListenerObject,
      {
        type: string;
        eventTarget: EventTarget;
        options?: boolean | AddEventListenerOptions;
      }
    >
  >(new Map());

  const addGlobalListener = useCallback(
    (
      eventTarget: EventTarget,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => {
      const wrappedListener =
        typeof options === 'object' && options?.once
          ? (...args: unknown[]) => {
              globalListeners.current.delete(listener);
              (listener as EventListener)(...(args as [Event]));
            }
          : listener;

      globalListeners.current.set(listener, { type, eventTarget, options });
      eventTarget.addEventListener(type, wrappedListener, options);
    },
    []
  );

  const removeGlobalListener = useCallback(
    (
      eventTarget: EventTarget,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ) => {
      const storedListener = globalListeners.current.get(listener);
      // @ts-expect-error
      const fn = storedListener?.options?.once ? storedListener.fn : listener;

      eventTarget.removeEventListener(type, fn as EventListener, options);
      globalListeners.current.delete(listener);
    },
    []
  );

  const removeAllGlobalListeners = useCallback(() => {
    globalListeners.current.forEach((value, key) => {
      value.eventTarget.removeEventListener(
        value.type,
        key as EventListenerOrEventListenerObject,
        value.options
      );
    });
    globalListeners.current.clear();
  }, []);

  useEffect(() => {
    return () => removeAllGlobalListeners();
  }, [removeAllGlobalListeners]);

  return { addGlobalListener, removeGlobalListener, removeAllGlobalListeners };
}
