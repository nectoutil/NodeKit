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

import { useEffectEvent } from '@necto-react/hooks';
import { createSyntheticEvent } from '@necto-react/helpers';
import { useRef, useCallback, useLayoutEffect } from 'react';

import type { FocusEvent } from 'react';
import type { UseSyntheticBlurEventProps, UseSyntheticBlurEventReturn } from './useSyntheticBlurEvent.types';

/**
 * React hook to handle synthetic blur events, particularly for disabled elements.
 *
 * @param onBlur - Callback to handle the blur event.
 * @returns A callback to attach to the element's blur event.
 */
export function useSyntheticBlurEvent<T extends Element = Element>(
  props: UseSyntheticBlurEventProps<T>
): UseSyntheticBlurEventReturn<T> {
  const { onBlur } = props;
  const stateRef = useRef<{
    isFocused: boolean;
    observer: MutationObserver | null;
  }>({
    isFocused: false,
    observer: null
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
  const dispatchBlur = useEffectEvent((e: FocusEvent<T>) => {
    onBlur?.(e);
  });

  // Callback to handle the blur event logic.
  return useCallback(
    (e: FocusEvent<T>) => {
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
            const syntheticEvent =
              createSyntheticEvent<FocusEvent<T>>(event);
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
            const relatedTargetEl =
              target === document.activeElement ? null : document.activeElement;
            target.dispatchEvent(
              new FocusEvent('blur', { relatedTarget: relatedTargetEl })
            );
            target.dispatchEvent(
              new FocusEvent('focusout', {
                bubbles: true,
                relatedTarget: relatedTargetEl
              })
            );
          }
        });

        // Observe changes to the 'disabled' attribute of the target element.
        stateRef.current.observer.observe(target, {
          attributes: true,
          attributeFilter: ['disabled']
        });
      }
    },
    [dispatchBlur]
  );
}
