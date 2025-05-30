import { useCallback, useEffect, useRef } from 'react';

interface GlobalListeners {
  addGlobalListener<K extends keyof WindowEventMap | keyof DocumentEventMap>(
    el: Window | EventTarget,
    type: K,
    listener: (
      this: Document,
      ev: K extends keyof WindowEventMap
        ? WindowEventMap[K]
        : K extends keyof DocumentEventMap
          ? DocumentEventMap[K]
          : never
    ) => void,
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
    listener: (
      this: Document,
      ev: K extends keyof WindowEventMap
        ? WindowEventMap[K]
        : DocumentEventMap[K]
    ) => void,
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
function useGlobalListeners(): GlobalListeners {
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

export { useGlobalListeners };
