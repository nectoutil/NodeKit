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
 *
 * @param {FocusableElement} element - The element to focus.
 */
export function focusWithoutScrolling(element: FocusableElement): void {
  if (supportsPreventScroll()) {
    element.focus({ preventScroll: true });
  } else {
    const scrollableElements: ScrollableElement[] =
      getScrollableElements(element);
    element.focus();

    for (const { element, scrollTop, scrollLeft } of scrollableElements) {
      element.scrollTop = scrollTop;
      element.scrollLeft = scrollLeft;
    }
  }
}

/**
 * Returns a list of all scrollable ancestor elements for a given element,
 * including the root scrolling element.
 *
 * @param {FocusableElement} element - The element whose scrollable ancestors are to be found.
 * @returns {ScrollableElement[]} An array of scrollable elements with their scroll positions.
 */
export function getScrollableElements(
  element: FocusableElement
): ScrollableElement[] {
  let parent: ParentNode | null = element.parentNode;
  const scrollableElements: ScrollableElement[] = Array.from({ length: 0 });
  const rootScrollingElement: Element =
    document.scrollingElement || document.documentElement;

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

  return scrollableElements;
}

export type { ScrollableElement } from './types';
