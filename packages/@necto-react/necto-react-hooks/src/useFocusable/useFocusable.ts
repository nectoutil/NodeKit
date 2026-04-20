/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Focusable hook requires any.

import {
  useFocus,
  useKeyboard,
  getInteractionModality
} from '@necto-react/hooks';
import {
  getOwnerDocument,
  getActiveElement,
  runAfterTransition,
  focusWithoutScrolling
} from '@necto/dom';
import { useEffect, useRef } from 'react';
import { mergeProps } from '@necto/mergers';

import type {
  UseFocusableReturn,
  UseFocusableOptions
} from './useFocusable.types';
import type { RefObject } from 'react';
import type { FocusableElement } from '@necto/types';

/**
 * React hook that provides focus management and keyboard accessibility for a focusable element.
 * Handles autofocus, disabled state, tab order, and merges focus and keyboard props.
 *
 * @param {UseFocusableOptions} options - Options controlling focus behavior and accessibility.
 * @param {RefObject<FocusableElement | null>} domRef - Ref to the DOM element to manage focus for.
 * @returns {UseFocusableReturn} Object containing merged props for focusable behavior.
 */
export function useFocusable(
  options: UseFocusableOptions,
  domRef: RefObject<FocusableElement | null>
): UseFocusableReturn {
  const { autoFocus, isDisabled, excludeFromTabOrder } = options;

  const { focusProps } = useFocus(options);
  const { keyboardProps } = useKeyboard(options);
  const autoFocusRef: RefObject<any> = useRef(autoFocus);

  const ownerDocument = getOwnerDocument(domRef.current);
  const activeElement: Element | null = ownerDocument
    ? getActiveElement(ownerDocument)
    : null;

  useEffect(() => {
    if (autoFocusRef.current && domRef.current) {
      if (getInteractionModality() === 'virtual') {
        const lastFocusedElement: Element | null = activeElement;
        runAfterTransition(() => {
          if (
            ownerDocument &&
            getActiveElement(ownerDocument) === lastFocusedElement &&
            domRef.current?.isConnected
          ) {
            focusWithoutScrolling(domRef.current);
          }
        });
      } else {
        focusWithoutScrolling(domRef.current);
      }
    }

    autoFocusRef.current = false;
  }, [domRef, activeElement, ownerDocument]);

  // Always set a tabIndex so that Safari allows focusing on native buttons and inputs.
  // Implemented as per React Aria feature mirror.
  let tabIndex: number | undefined = excludeFromTabOrder ? -1 : 0;

  if (isDisabled) {
    tabIndex = undefined;
  }

  return {
    focusableProps: mergeProps(focusProps ?? {}, keyboardProps, { tabIndex })
  };
}
