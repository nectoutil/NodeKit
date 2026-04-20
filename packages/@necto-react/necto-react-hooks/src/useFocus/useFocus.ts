/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback } from 'react';
import { useSyntheticBlurEvent } from '@necto-react/hooks';
import { getOwnerDocument, getEventTarget, getActiveElement } from '@necto/dom';

import type { FocusableElement } from '@necto/types';
import type { DOMAttributes } from '@necto-react/types';
import type { FocusEvent as ReactFocusEvent } from 'react';
import type { UseFocusOptions, UseFocusReturn } from './useFocus.types';

/**
 * React hook that manages focus and blur event handling for a focusable element.
 *
 * @template T The type of the focusable element.
 * @param {UseFocusOptions<T>} [options] - Options and event handlers for focus management.
 * @returns {UseFocusReturn<T>} An object containing props to spread on the target element for focus management.
 */
export function useFocus<T extends FocusableElement = FocusableElement>(
  options: UseFocusOptions<T> = {}
): UseFocusReturn<T> {
  const {
    isDisabled,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onFocusChange
  } = options;

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
  const onSyntheticFocus = useSyntheticBlurEvent<T>({ onBlur });

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
