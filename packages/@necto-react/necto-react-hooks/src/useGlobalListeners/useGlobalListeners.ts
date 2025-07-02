/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
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
      // @ts-ignore
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
