/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Portions of this code are based on the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications have been made to adapt the code for use in this project.
 */

'use strict';

import { useCallback, useEffect, useRef } from "react";

interface GlobalListeners {
  addGlobalListener<K extends keyof WindowEventMap | keyof DocumentEventMap>(
    el: Window | EventTarget,
    type: K,
    listener: (this: Document, ev: K extends keyof WindowEventMap ? WindowEventMap[K] : K extends keyof DocumentEventMap ? DocumentEventMap[K] : never) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeGlobalListener<K extends keyof WindowEventMap & keyof DocumentEventMap>(
    el: Window | EventTarget,
    type: K,
    listener: (this: Document, ev: K extends keyof WindowEventMap ? WindowEventMap[K] : DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
  removeAllGlobalListeners(): void;
}

/**
 * A hook that provides utilities for managing global event listeners.
 * It allows adding, removing, and cleaning up event listeners on global targets like `window` or `document`.
 */
export function useGlobalListeners(): GlobalListeners {
  const globalListeners = useRef<Map<EventListenerOrEventListenerObject, { type: string; eventTarget: EventTarget; options?: boolean | AddEventListenerOptions }>>(new Map());

  const addGlobalListener = useCallback(
    (eventTarget: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
      const wrappedListener = typeof options === 'object' && options?.once
        ? (...args: any[]) => {
            globalListeners.current.delete(listener);
            (listener as EventListener)(...args as [any]);
          }
        : listener;

      globalListeners.current.set(listener, { type, eventTarget, options });
      eventTarget.addEventListener(type, wrappedListener, options);
    },
    []
  );

  const removeGlobalListener = useCallback(
    (eventTarget: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
      const storedListener = globalListeners.current.get(listener);
      const fn = storedListener?.options?.once ? storedListener.fn : listener;

      eventTarget.removeEventListener(type, fn as EventListener, options);
      globalListeners.current.delete(listener);
    },
    []
  );

  const removeAllGlobalListeners = useCallback(() => {
    globalListeners.current.forEach(({ type, eventTarget, options }: { type: string; eventTarget: EventTarget; options?: boolean | AddEventListenerOptions }, listener: EventListener) => {
      eventTarget.removeEventListener(type, listener as EventListener, options);
    });
    globalListeners.current.clear();
  }, []);

  useEffect(() => {
    return () => removeAllGlobalListeners();
  }, [removeAllGlobalListeners]);

  return { addGlobalListener, removeGlobalListener, removeAllGlobalListeners };
}