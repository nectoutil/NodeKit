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

export function createSyntheticEvent<E extends SyntheticEvent>(nativeEvent: Event): E {
  let event = nativeEvent as any as E;
  event.nativeEvent = nativeEvent;
  event.isDefaultPrevented = () => event.defaultPrevented;
  // cancelBubble is technically deprecated in the spec, but still supported in all browsers.
  event.isPropagationStopped = () => (event as any).cancelBubble;
  event.persist = () => {};
  return event;
}

export function useSyntheticBlurEvent<Target extends Element = Element>(onBlur: (event: ReactFocusEvent<Target>) => void): (event: ReactFocusEvent<Target>) => void {
  let stateRef = useRef({
    isFocused: false,
    observer: null as MutationObserver | null
  });

  (typeof document !== "undefined" ? useLayoutEffect : () => {})(
    () => {
      const state = stateRef.current;
      return () => {
        if (state.observer) {
          state.observer.disconnect();
          state.observer = null;
        }
      };
    },
    []
  );

  let dispatchBlur = useEffectEvent((e: ReactFocusEvent<Target>) => {
    onBlur?.(e);
  });

  return useCallback((e: ReactFocusEvent<Target>) => {
    // React does not fire onBlur when an element is disabled. https://github.com/facebook/react/issues/9142
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      stateRef.current.isFocused = true;

      let target = e.target;
      let onBlurHandler: EventListenerOrEventListenerObject | null = (e) => {
        stateRef.current.isFocused = false;

        if (target.disabled) {
          // For backward compatibility, dispatch a (fake) React synthetic event.
          let event = createSyntheticEvent<ReactFocusEvent<Target>>(e);
          dispatchBlur(event);
        }

        // We no longer need the MutationObserver once the target is blurred.
        if (stateRef.current.observer) {
          stateRef.current.observer.disconnect();
          stateRef.current.observer = null;
        }
      };

      target.addEventListener('focusout', onBlurHandler, {once: true});

      stateRef.current.observer = new MutationObserver(() => {
        if (stateRef.current.isFocused && target.disabled) {
          stateRef.current.observer?.disconnect();
          let relatedTargetEl = target === document.activeElement ? null : document.activeElement;
          target.dispatchEvent(new FocusEvent('blur', {relatedTarget: relatedTargetEl}));
          target.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: relatedTargetEl}));
        }
      });

      stateRef.current.observer.observe(target, {attributes: true, attributeFilter: ['disabled']});
    }
  }, [dispatchBlur]);
}