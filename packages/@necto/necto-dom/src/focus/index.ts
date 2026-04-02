/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

import { supportsPreventScroll } from '../scroll';

import type { ScrollableElement } from './types';
import type { FocusableElement } from '@necto/types';

/**
 * Focuses the given element without causing the page to scroll.
 * Uses the native preventScroll option if supported, otherwise manually restores scroll positions.
 */
export function focusWithoutScrolling(element: FocusableElement): void {
  if (supportsPreventScroll()) {
    element.focus({ preventScroll: true });
  } else {
    let parent: ParentNode | null = element.parentNode;
    const scrollableElements: ScrollableElement[] = [];
    const rootScrollingElement: Element | null =
      typeof document !== 'undefined'
        ? document.scrollingElement || document.documentElement
        : null;

    while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
      if (
        parent.offsetHeight < parent.scrollHeight ||
        parent.offsetWidth < parent.scrollWidth
      ) {
        scrollableElements.push({
          element: parent,
          scrollTop: parent.scrollTop,
          scrollLeft: parent.scrollLeft
        });
      }

      parent = parent.parentNode;
    }

    if (rootScrollingElement instanceof HTMLElement) {
      scrollableElements.push({
        element: rootScrollingElement,
        scrollTop: rootScrollingElement.scrollTop,
        scrollLeft: rootScrollingElement.scrollLeft
      });
    }

    element.focus();

    for (const { element, scrollTop, scrollLeft } of scrollableElements) {
      element.scrollTop = scrollTop;
      element.scrollLeft = scrollLeft;
    }
  }
}
