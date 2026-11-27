/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let supportsPreventScrollCached: boolean | null = null;

/** Detects if the browser supports the preventScroll option in focus() */
export function supportsPreventScroll(): boolean {
  if (supportsPreventScrollCached == null) {
    supportsPreventScrollCached = false;

    if (typeof document !== 'undefined') {
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
      scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top);
    } else if (block === 'end' || (block === 'nearest' && isBelow)) {
      scrollTop = scrollContainer.scrollTop + (elementRect.bottom - containerRect.bottom);
    } else if (block === 'center') {
      const containerCenter: number = containerRect.top + containerRect.height / 2;
      const elementCenter: number = elementRect.top + elementRect.height / 2;
      scrollTop = scrollContainer.scrollTop + (elementCenter - containerCenter);
    }

    scrollContainer.scrollTop = scrollTop;
  }

  // Horizontal scrolling
  if (isLeft || isRight) {
    let scrollLeft: number = scrollContainer.scrollLeft;

    if (inline === 'start' || (inline === 'nearest' && isLeft)) {
      scrollLeft = scrollContainer.scrollLeft + (elementRect.left - containerRect.left);
    } else if (inline === 'end' || (inline === 'nearest' && isRight)) {
      scrollLeft = scrollContainer.scrollLeft + (elementRect.right - containerRect.right);
    } else if (inline === 'center') {
      const containerCenter: number = containerRect.left + containerRect.width / 2;
      const elementCenter: number = elementRect.left + elementRect.width / 2;
      scrollLeft = scrollContainer.scrollLeft + (elementCenter - containerCenter);
    }

    scrollContainer.scrollLeft = scrollLeft;
  }
}
