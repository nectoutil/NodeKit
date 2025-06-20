/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { mergeProps } from '@necto/mergers';
import { useEffect, useRef, useContext } from 'react';
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

import type { RefObject } from 'react';
import type { FocusableElement } from '@necto/types';
import type {
  UseFocusableProps,
  UseFocusableReturn
} from './useFocusable.types';

export function useFocusable(
  props: UseFocusableProps,
  domRef: RefObject<FocusableElement | null>
): UseFocusableReturn {
  const { autoFocus, isDisabled, excludeFromTabOrder } = props;

  let { focusProps } = useFocus(props);
  let { keyboardProps } = useKeyboard(props);
  let autoFocusRef: RefObject<any> = useRef(autoFocus);

  const ownerDocument: Document = getOwnerDocument(domRef.current);
  const activeElement: Element | null = getActiveElement(ownerDocument);

  useEffect(() => {
    if (autoFocusRef.current && domRef.current) {
      if (getInteractionModality() === 'virtual') {
        let lastFocusedElement = activeElement;
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

  // Always set a tabIndex so that Safari allows focusing native buttons and inputs.
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
