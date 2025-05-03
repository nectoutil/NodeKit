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

import { useCallback, useRef } from "react";
import { useGlobalListeners } from "./useGlobalListeners";
import { useSyntheticBlurEvent, createSyntheticEvent } from "./useSyntheticBlurEvent";
import { getActiveElement, getEventTarget, getOwnerDocument, nodeContains } from "@necto/dom";

import type { DOMAttributes } from "@necto-react/types";
import type { FocusEvent as ReactFocusEvent } from "react";

export interface FocusWithinProps {
  isDisabled?: boolean,
  onFocusWithin?: (e: ReactFocusEvent) => void,
  onBlurWithin?: (e: ReactFocusEvent) => void,
  onFocusWithinChange?: (isFocusWithin: boolean) => void
}

export interface FocusWithinResult {
  focusWithinProps: DOMAttributes
}

export function useFocusWithin(props: FocusWithinProps): FocusWithinResult {
  let { isDisabled, onFocusWithin, onBlurWithin, onFocusWithinChange } = props;
  let state = useRef({ isFocusWithin: false });
  let { addGlobalListener, removeAllGlobalListeners } = useGlobalListeners();

  let onBlur = useCallback((event: ReactFocusEvent) => {
    if (!event.currentTarget.contains(event.target)) return;

    if (state.current.isFocusWithin && !(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
      state.current.isFocusWithin = false;
      removeAllGlobalListeners();

      if (onBlurWithin) onBlurWithin(event);
      if (onFocusWithinChange) onFocusWithinChange(false);
    }
  }, [onBlurWithin, onFocusWithinChange, state, removeAllGlobalListeners]);

  let onSyntheticFocus = useSyntheticBlurEvent(onBlur);
  let onFocus = useCallback((event: ReactFocusEvent) => {
    if (!event.currentTarget.contains(event.target)) return;

    const ownerDocument = getOwnerDocument(event.target);
    const activeElement = getActiveElement(ownerDocument);

    if (!state.current.isFocusWithin && activeElement == getEventTarget(event.nativeEvent)) {
      if (onFocusWithin) onFocusWithin(event);
      if (onFocusWithinChange) onFocusWithinChange(true);

      state.current.isFocusWithin = true;
      onSyntheticFocus(event);

      let currentTarget = event.currentTarget;
      addGlobalListener(ownerDocument, 'focus', e => {
        if (state.current.isFocusWithin && !nodeContains(currentTarget, e.target as Element)) {
          let nativeEvent = new ownerDocument.defaultView!.FocusEvent('blur', {relatedTarget: e.target});
          Object.defineProperty(nativeEvent, 'target', {value: currentTarget});
          Object.defineProperty(nativeEvent, 'currentTarget', {value: currentTarget});
          let event = createSyntheticEvent<ReactFocusEvent>(nativeEvent);
          onBlur(event);
        }
      }, {capture: true});
    }
  },  [onFocusWithin, onFocusWithinChange, onSyntheticFocus, addGlobalListener, onBlur]);

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
  }
}