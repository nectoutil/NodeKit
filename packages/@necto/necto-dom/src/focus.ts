/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { supportsPreventScroll } from './scroll';

import type { ScrollableElement } from './types/focus';
import type { FocusableElement } from '@necto/types';

export function focusWithoutScrolling(element: FocusableElement): void {
  if (supportsPreventScroll()) {
    element.focus({ preventScroll: true });
    return;
  }

  let parent: ParentNode | null = element.parentNode;
  const scrollableElements: ScrollableElement[] = [];
  const rootScrollingElement: Element | null =
    typeof document !== 'undefined' ? document.scrollingElement || document.documentElement : null;

  while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
    if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) {
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

  for (const { element: scrollable, scrollTop, scrollLeft } of scrollableElements) {
    scrollable.scrollTop = scrollTop;
    scrollable.scrollLeft = scrollLeft;
  }
}
