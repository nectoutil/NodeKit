/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getOwnerWindow, getOwnerDocument } from '@necto/dom';

export interface AutoUpdateOptions {
  /**
   * Whether to update on ancestor scroll events.
   * @default true
   */
  ancestorScroll?: boolean;

  /**
   * Whether to update on ancestor resize events.
   * @default true
   */
  ancestorResize?: boolean;

  /**
   * Whether to update when the reference element resizes.
   * @default true
   */
  elementResize?: boolean;

  /**
   * Whether to update on layout shifts.
   * @default true
   */
  layoutShift?: boolean;

  /**
   * Whether to update using requestAnimationFrame polling.
   * @default false
   */
  animationFrame?: boolean;
}

/**
 * Gets all scroll ancestor elements of a given element.
 * @param element - The element to get scroll ancestors for.
 * @returns Array of scrollable ancestor elements.
 */
function getScrollAncestors(element: Element): Array<Element | Window> {
  const ancestors: Array<Element | Window> = [];
  let current: Element | null = element.parentElement;

  while (current) {
    const { overflow, overflowX, overflowY } = getComputedStyle(current);
    if (/auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)) {
      ancestors.push(current);
    }
    current = current.parentElement;
  }

  ancestors.push(getOwnerWindow(element));
  return ancestors;
}

/**
 * Automatically updates the floating element position when necessary.
 * @param reference - The reference element.
 * @param floating - The floating element.
 * @param update - The update function to call.
 * @param options - Configuration options.
 * @returns A cleanup function to stop auto-updating.
 */
export function autoUpdate(
  reference: Element,
  floating: HTMLElement,
  update: () => void,
  options: AutoUpdateOptions = {}
): () => void {
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
    layoutShift = true,
    animationFrame = false
  } = options;

  const ancestors =
    ancestorScroll || ancestorResize
      ? [...getScrollAncestors(reference), ...getScrollAncestors(floating)]
      : [];

  const cleanupFns: Array<() => void> = [];

  if (ancestorScroll) {
    for (const ancestor of ancestors) {
      ancestor.addEventListener('scroll', update, { passive: true });
      cleanupFns.push(() => ancestor.removeEventListener('scroll', update));
    }
  }

  if (ancestorResize) {
    const win = getOwnerWindow(reference);
    win.addEventListener('resize', update);
    cleanupFns.push(() => win.removeEventListener('resize', update));
  }

  let resizeObserver: ResizeObserver | null = null;
  if (elementResize && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      update();
    });
    resizeObserver.observe(reference);
    resizeObserver.observe(floating);
    cleanupFns.push(() => resizeObserver?.disconnect());
  }

  let intersectionObserver: IntersectionObserver | null = null;
  if (layoutShift && typeof IntersectionObserver !== 'undefined') {
    let prevRect = reference.getBoundingClientRect();
    intersectionObserver = new IntersectionObserver(
      () => {
        const newRect = reference.getBoundingClientRect();
        if (
          prevRect.x !== newRect.x ||
          prevRect.y !== newRect.y ||
          prevRect.width !== newRect.width ||
          prevRect.height !== newRect.height
        ) {
          update();
        }
        prevRect = newRect;
      },
      {
        root: getOwnerDocument(reference),
        threshold: Array.from({ length: 101 }, (_, i) => i / 100)
      }
    );
    intersectionObserver.observe(reference);
    cleanupFns.push(() => intersectionObserver?.disconnect());
  }

  let frameId: number | null = null;
  if (animationFrame) {
    let prevRect = reference.getBoundingClientRect();
    const frameLoop = () => {
      const newRect = reference.getBoundingClientRect();
      if (
        prevRect.x !== newRect.x ||
        prevRect.y !== newRect.y ||
        prevRect.width !== newRect.width ||
        prevRect.height !== newRect.height
      ) {
        update();
      }
      prevRect = newRect;
      frameId = requestAnimationFrame(frameLoop);
    };
    frameId = requestAnimationFrame(frameLoop);
    cleanupFns.push(() => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    });
  }

  update();

  return () => {
    for (const cleanup of cleanupFns) {
      cleanup();
    }
  };
}
