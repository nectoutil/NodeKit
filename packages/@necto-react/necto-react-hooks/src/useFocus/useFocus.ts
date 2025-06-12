/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
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
