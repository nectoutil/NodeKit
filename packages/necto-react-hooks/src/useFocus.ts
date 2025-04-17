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

import { useCallback } from 'react';
import { useSyntheticBlurEvent } from "./useSyntheticBlurEvent";
import { getOwnerDocument, getEventTarget, getActiveElement } from "@necto/dom";

import type { FocusEvent as ReactFocusEvent } from 'react';
import type { DOMAttributes, FocusableElement, FocusEvent } from '@necto-react/types';

export interface FocusProps<Target = FocusableElement> extends FocusEvent<Target> {
  isDisabled?: boolean;
}

export interface FocusResult<Target = FocusableElement> {
  focusProps: DOMAttributes<Target>
}

export function useFocus<Target extends FocusableElement = FocusableElement>(props: FocusProps<Target>): FocusResult<Target> {
  const { isDisabled, onFocus: onFocusProp, onBlur: onBlurProp, onFocusChange } = props;

  // Unified handler for focus change
  const handleFocusChange = useCallback(
    (isFocused: boolean, e: ReactFocusEvent<Target>) => {
      if (isFocused) {
        onFocusProp?.(e);
        onFocusChange?.(true);
      } else {
        onBlurProp?.(e);
        onFocusChange?.(false);
      }
    },
    [onFocusProp, onBlurProp, onFocusChange]
  );

  // Blur handler
  const onBlur = useCallback(
    (e: ReactFocusEvent<Target>) => {
      if (e.target === e.currentTarget) {
        handleFocusChange(false, e);
      }
    },
    [handleFocusChange]
  );

  // Synthetic focus handler
  const onSyntheticFocus = useSyntheticBlurEvent<Target>(onBlur);

  // Focus handler
  const onFocus = useCallback(
    (e: ReactFocusEvent<Target>) => {
      const ownerDocument = getOwnerDocument(e.target);
      const activeElement = ownerDocument ? getActiveElement(ownerDocument) : getActiveElement();
      if (e.target === e.currentTarget && activeElement === getEventTarget(e.nativeEvent)) {
        handleFocusChange(true, e);
        onSyntheticFocus(e);
      }
    },
    [handleFocusChange, onSyntheticFocus]
  );

  // Return focus props
  return {
    focusProps: {
      ...(isDisabled ? {} : { onFocus, onBlur }),
    } as DOMAttributes<Target>,
  };
}