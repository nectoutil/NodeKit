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

import { useEffectEvent } from "./useEffectEvent";
import { useRef, useCallback, useLayoutEffect } from 'react';
import type { FocusEvent as ReactFocusEvent, SyntheticEvent } from 'react';

/**
 * Creates a synthetic React event from a native DOM event.
 * This is used to maintain compatibility with React's event system.
 * 
 * @param nativeEvent - The original native DOM event.
 * @returns The synthetic React event.
 */
export function createSyntheticEvent<E extends SyntheticEvent>(nativeEvent: Event): E {
  const event = nativeEvent as unknown as E;
  event.nativeEvent = nativeEvent;
  event.isDefaultPrevented = () => event.defaultPrevented;
  event.isPropagationStopped = () => (event as any).cancelBubble; // Deprecated but widely supported.
  event.persist = () => {}; // No-op for compatibility with React's synthetic event system.
  return event;
}

/**
 * Custom React hook to handle synthetic blur events, particularly for disabled elements.
 * 
 * @param onBlur - Callback to handle the blur event.
 * @returns A callback to attach to the element's blur event.
 */
export function useSyntheticBlurEvent<Target extends Element = Element>(
  onBlur: (event: ReactFocusEvent<Target>) => void
): (event: ReactFocusEvent<Target>) => void {
  const stateRef = useRef<{
    isFocused: boolean;
    observer: MutationObserver | null;
  }>({
    isFocused: false,
    observer: null,
  });

  // Cleanup effect to disconnect the MutationObserver when the component unmounts.
  useLayoutEffect(() => {
    const state = stateRef.current;
    return () => {
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
    };
  }, []);

  // Handler to dispatch the blur event using the provided callback.
  const dispatchBlur = useEffectEvent((e: ReactFocusEvent<Target>) => {
    onBlur?.(e);
  });

  // Callback to handle the blur event logic.
  return useCallback((e: ReactFocusEvent<Target>) => {
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      stateRef.current.isFocused = true;

      const target = e.target;
      const onBlurHandler: EventListenerOrEventListenerObject = (event) => {
        stateRef.current.isFocused = false;

        if (target.disabled) {
          // Dispatch a synthetic React event for backward compatibility.
          const syntheticEvent = createSyntheticEvent<ReactFocusEvent<Target>>(event);
          dispatchBlur(syntheticEvent);
        }

        // Cleanup the MutationObserver once the target is blurred.
        if (stateRef.current.observer) {
          stateRef.current.observer.disconnect();
          stateRef.current.observer = null;
        }
      };

      // Add a one-time blur event listener.
      target.addEventListener('focusout', onBlurHandler, { once: true });

      // Set up a MutationObserver to monitor changes to the 'disabled' attribute.
      stateRef.current.observer = new MutationObserver(() => {
        if (stateRef.current.isFocused && target.disabled) {
          stateRef.current.observer?.disconnect();
          const relatedTargetEl = target === document.activeElement ? null : document.activeElement;
          target.dispatchEvent(new FocusEvent('blur', { relatedTarget: relatedTargetEl }));
          target.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: relatedTargetEl }));
        }
      });

      // Observe changes to the 'disabled' attribute of the target element.
      stateRef.current.observer.observe(target, { attributes: true, attributeFilter: ['disabled'] });
    }
  }, [dispatchBlur]);
}
