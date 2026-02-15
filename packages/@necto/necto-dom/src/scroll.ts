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

let supportsPreventScrollCached: boolean | null = null;

/** Detects if the browser supports the preventScroll option in focus() */
export function supportsPreventScroll(): boolean {
  if (supportsPreventScrollCached == null) {
    supportsPreventScrollCached = false;
    try {
      const focusElement: HTMLDivElement = document.createElement('div');
      focusElement.focus({
        get preventScroll(): boolean {
          supportsPreventScrollCached = true;
          return true;
        }
      });
    } catch {
      // Ignore
    }
  }

  return supportsPreventScrollCached;
}

/**
 * Scrolls an element into view within a scrollable container.
 *
 * @param scrollContainer - The scrollable container element.
 * @param element - The element to scroll into view.
 * @param options - Optional scroll behavior options.
 */
export function scrollIntoView(
  scrollContainer: HTMLElement,
  element: HTMLElement,
  options?: { block?: ScrollLogicalPosition; inline?: ScrollLogicalPosition }
): void {
  const { block = 'nearest', inline = 'nearest' } = options ?? {};

  const containerRect: DOMRect = scrollContainer.getBoundingClientRect();
  const elementRect: DOMRect = element.getBoundingClientRect();

  // Calculate if element is outside the visible area
  const isAbove: boolean = elementRect.top < containerRect.top;
  const isBelow: boolean = elementRect.bottom > containerRect.bottom;
  const isLeft: boolean = elementRect.left < containerRect.left;
  const isRight: boolean = elementRect.right > containerRect.right;

  // Vertical scrolling
  if (isAbove || isBelow) {
    let scrollTop: number = scrollContainer.scrollTop;

    if (block === 'start' || (block === 'nearest' && isAbove)) {
      scrollTop =
        scrollContainer.scrollTop + (elementRect.top - containerRect.top);
    } else if (block === 'end' || (block === 'nearest' && isBelow)) {
      scrollTop =
        scrollContainer.scrollTop + (elementRect.bottom - containerRect.bottom);
    } else if (block === 'center') {
      const containerCenter: number =
        containerRect.top + containerRect.height / 2;
      const elementCenter: number = elementRect.top + elementRect.height / 2;
      scrollTop = scrollContainer.scrollTop + (elementCenter - containerCenter);
    }

    scrollContainer.scrollTop = scrollTop;
  }

  // Horizontal scrolling
  if (isLeft || isRight) {
    let scrollLeft: number = scrollContainer.scrollLeft;

    if (inline === 'start' || (inline === 'nearest' && isLeft)) {
      scrollLeft =
        scrollContainer.scrollLeft + (elementRect.left - containerRect.left);
    } else if (inline === 'end' || (inline === 'nearest' && isRight)) {
      scrollLeft =
        scrollContainer.scrollLeft + (elementRect.right - containerRect.right);
    } else if (inline === 'center') {
      const containerCenter: number =
        containerRect.left + containerRect.width / 2;
      const elementCenter: number = elementRect.left + elementRect.width / 2;
      scrollLeft =
        scrollContainer.scrollLeft + (elementCenter - containerCenter);
    }

    scrollContainer.scrollLeft = scrollLeft;
  }
}

/**
 * Scrolls an element into the viewport if it's not already visible.
 *
 * @param element - The element to scroll into viewport.
 * @param options - Optional options for scrolling behavior.
 */
export function scrollIntoViewport(
  element: HTMLElement,
  options?: { containingElement?: HTMLElement | null }
): void {
  const { containingElement } = options ?? {};

  // Use native scrollIntoView with smooth behavior
  element.scrollIntoView({
    behavior: 'auto',
    block: 'nearest',
    inline: 'nearest'
  });

  // If there's a containing element, ensure it's also visible
  if (containingElement) {
    containingElement.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'nearest'
    });
  }
}
