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

import { useCallback, useRef } from 'react';
import { createSyntheticEvent } from '@necto-react/helpers';
import { useGlobalListeners, useSyntheticBlurEvent } from '@necto-react/hooks';
import {
  getOwnerDocument,
  getActiveElement,
  getEventTarget,
  nodeContains
} from '@necto/dom';

import type { RefObject, FocusEvent } from 'react';
import type { DOMAttributes } from '@necto-react/types';
import type { UseSyntheticBlurEventReturn } from '@necto-react/hooks';
import type {
  UseFocusWithinProps,
  FocusWithinReturn
} from './useFocusWithin.types';

export function useFocusWithin(props: UseFocusWithinProps): FocusWithinReturn {
  const { isDisabled, onFocusWithin, onBlurWithin, onFocusWithinChange } =
    props;
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

      const ownerDocument: Document = getOwnerDocument(event.target);
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
              // This might cause issues, fix if it does and revert to: const nativeEvent = new ownerDocument.defaultView!.FocusEvent(
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
