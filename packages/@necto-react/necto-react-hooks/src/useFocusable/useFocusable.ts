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

import {
  useFocus,
  useKeyboard,
  useSyncContextRef,
  getInteractionModality
} from '@necto-react/hooks';
import {
  getOwnerDocument,
  getActiveElement,
  runAfterTransition,
  focusWithoutScrolling
} from '@necto/dom';
import { mergeProps } from '@necto/mergers';
import { useEffect, useRef, useContext } from 'react';
import { FocusableContext } from '@necto-react/contexts';

import type {
  UseFocusableProps,
  UseFocusableReturn
} from './useFocusable.types';
import type { RefObject } from 'react';
import type { FocusableElement } from '@necto/types';

/**
 * React hook that provides focus management and keyboard accessibility for a focusable element.
 * Handles autofocus, disabled state, tab order, and merges focus and keyboard props.
 *
 * @param {UseFocusableProps} props - Props controlling focus behavior and accessibility.
 * @param {RefObject<FocusableElement | null>} domRef - Ref to the DOM element to manage focus for.
 * @returns {UseFocusableReturn} Object containing merged props for focusable behavior.
 */
export function useFocusable(
  props: UseFocusableProps,
  domRef: RefObject<FocusableElement | null>
): UseFocusableReturn {
  const { autoFocus, isDisabled, excludeFromTabOrder } = props;

  let { focusProps } = useFocus(props);
  let { keyboardProps } = useKeyboard(props);
  let context = useContext(FocusableContext) || {};
  let autoFocusRef: RefObject<any> = useRef(autoFocus);

  // Synchronize the local ref with the context ref so both always point to the same DOM element.
  useSyncContextRef({ context: context, ref: domRef });
  let { ref: _, ...domProps } = context;

  const ownerDocument: Document = getOwnerDocument(domRef.current);
  const activeElement: Element | null = getActiveElement(ownerDocument);

  useEffect(() => {
    if (autoFocusRef.current && domRef.current) {
      if (getInteractionModality() === 'virtual') {
        let lastFocusedElement: Element | null = activeElement;
        runAfterTransition(() => {
          if (
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
  }, [domRef]);

  // Always set a tabIndex so that Safari allows focusing on native buttons and inputs.
  // Implemented as per React Aria feature mirror.
  let tabIndex: number | undefined = excludeFromTabOrder ? -1 : 0;
  if (isDisabled) {
    tabIndex = undefined;
  }

  return {
    focusableProps: mergeProps(
      {
        ...mergeProps(focusProps ?? {}, keyboardProps),
        tabIndex
      },
      isDisabled ? {} : domProps
    )
  };
}
