/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  nodeContains,
  getEventTarget,
  getOwnerDocument,
  getActiveElement
} from '@necto/dom';
import { useCallback, useRef } from 'react';
import { createSyntheticEvent } from '@necto-react/helpers';
import { useGlobalListeners, useSyntheticBlurEvent } from '@necto-react/hooks';

import type {
  FocusWithinReturn,
  UseFocusWithinOptions
} from './useFocusWithin.types';
import type { RefObject, FocusEvent } from 'react';
import type { DOMAttributes } from '@necto-react/types';
import type { UseSyntheticBlurEventReturn } from '@necto-react/hooks';

export function useFocusWithin(
  options: UseFocusWithinOptions
): FocusWithinReturn {
  const { isDisabled, onFocusWithin, onBlurWithin, onFocusWithinChange } =
    options;
  const state: RefObject<{ isFocusWithin: boolean }> = useRef({
    isFocusWithin: false
  });
  const { addGlobalListener, removeAllGlobalListeners } = useGlobalListeners();

  const onBlur: (event: FocusEvent<Element, Element>) => void = useCallback(
    (event: FocusEvent) => {
      if (!event.currentTarget.contains(event.target)) return;

      if (
        state.current.isFocusWithin &&
        !(event.currentTarget as Element).contains(
          event.relatedTarget as Element
        )
      ) {
        state.current.isFocusWithin = false;
        removeAllGlobalListeners();

        if (onBlurWithin) onBlurWithin(event);
        if (onFocusWithinChange) onFocusWithinChange(false);
      }
    },
    [onBlurWithin, onFocusWithinChange, removeAllGlobalListeners]
  );

  const onSyntheticFocus: UseSyntheticBlurEventReturn<Element> =
    useSyntheticBlurEvent({ onBlur });
  const onFocus: (event: FocusEvent<Element, Element>) => void = useCallback(
    (event: FocusEvent) => {
      if (!event.currentTarget.contains(event.target)) return;

      const ownerDocument = getOwnerDocument(event.target);
      if (!ownerDocument) return;
      const activeElement: Element | null = getActiveElement(ownerDocument);

      if (
        !state.current.isFocusWithin &&
        activeElement === getEventTarget(event.nativeEvent)
      ) {
        if (onFocusWithin) onFocusWithin(event);
        if (onFocusWithinChange) onFocusWithinChange(true);

        state.current.isFocusWithin = true;
        onSyntheticFocus(event);

        const currentTarget = event.currentTarget;
        addGlobalListener(
          ownerDocument,
          'focus',
          (e) => {
            if (
              state.current.isFocusWithin &&
              !nodeContains(currentTarget, e.target as Element)
            ) {
              if (
                ownerDocument.defaultView &&
                typeof ownerDocument.defaultView.FocusEvent === 'function'
              ) {
                const nativeEvent = new ownerDocument.defaultView.FocusEvent(
                  'blur',
                  { relatedTarget: e.target }
                );

                Object.defineProperty(nativeEvent, 'target', {
                  value: currentTarget
                });

                Object.defineProperty(nativeEvent, 'currentTarget', {
                  value: currentTarget
                });

                const event: FocusEvent =
                  createSyntheticEvent<FocusEvent>(nativeEvent);
                onBlur(event);
              }
            }
          },
          { capture: true }
        );
      }
    },
    [
      onFocusWithin,
      onFocusWithinChange,
      onSyntheticFocus,
      addGlobalListener,
      onBlur
    ]
  );

  if (isDisabled) {
    return {
      focusWithinProps: {
        onFocus: undefined,
        onBlur: undefined
      } as DOMAttributes
    };
  }

  return {
    focusWithinProps: {
      onFocus,
      onBlur
    } as unknown as DOMAttributes
  };
}
