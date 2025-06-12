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

import { useCallback } from 'react';
import { useSyntheticBlurEvent } from '../useSyntheticBlurEvent';
import { getOwnerDocument, getEventTarget, getActiveElement } from '@necto/dom';

import type { FocusEvent as ReactFocusEvent } from 'react';
import type { UseFocusProps, UseFocusReturn } from './types';
import type { FocusableElement, DOMAttributes } from '@necto-react/types';

export function useFocus<T extends FocusableElement = FocusableElement>(
  props: UseFocusProps<T> = {}
): UseFocusReturn<T> {
  const {
    isDisabled,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onFocusChange
  } = props;

  // Unified handler for focus change
  const handleFocusChange = useCallback(
    (isFocused: boolean, e: ReactFocusEvent<T>) => {
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

  // --- Blur Handler ---
  const onBlur = useCallback(
    (e: ReactFocusEvent<T>) => {
      if (e.target === e.currentTarget) {
        handleFocusChange(false, e);
      }
    },
    [handleFocusChange]
  );

  // --- Synthetic Focus Handler ---
  const onSyntheticFocus = useSyntheticBlurEvent<T>(onBlur);

  // --- Focus Handler ---
  const onFocus = useCallback(
    (e: ReactFocusEvent<T>) => {
      const ownerDocument = getOwnerDocument(e.target);
      const activeElement = ownerDocument
        ? getActiveElement(ownerDocument)
        : getActiveElement();
      if (
        e.target === e.currentTarget &&
        activeElement === getEventTarget(e.nativeEvent)
      ) {
        handleFocusChange(true, e);
        onSyntheticFocus(e);
      }
    },
    [handleFocusChange, onSyntheticFocus]
  );

  return {
    focusProps: {
      ...(isDisabled ? {} : { onFocus, onBlur })
    } as DOMAttributes<T>
  };
}
