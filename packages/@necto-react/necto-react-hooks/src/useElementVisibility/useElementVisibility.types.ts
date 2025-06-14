/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RefObject } from 'react';

/**
 * Indicates whether partial visibility is allowed, or specifies the edge(s) to check for partial visibility.
 */
export type PartialVisibility = boolean | "top" | "right" | "bottom" | "left";

/**
 * Props for the useElementVisibility hook.
 */
export interface UseElementVisibilityProps {
   /** Whether partial visibility is allowed, or which edge to check. */
  partialVisibility?: PartialVisibility;

  /** The threshold(s) at which to trigger the observer callback. */
  threshold?: number | number[];

  /** Margin around the root element. Can shrink or grow each side of the root element's bounding box. */
  rootMargin?: string;

  /** The element that is used as the viewport for checking visibility. */
  root?: Element | Document | null;

  /** Whether the visibility check is active. */
  active?: boolean;

  /** Whether the visibility state should persist once element becomes visible. */
  once?: boolean;

  /** Callback fired when the visibility state changes. */
  onChange?: (isVisible: boolean) => void;
}

/** Intersection details provided by IntersectionObserver. */
export interface IntersectionDetails {
  /** Whether the element is intersecting with the root. */
  isIntersecting: boolean;

  /** The ratio of the intersection area to the bounding box of the target. */
  intersectionRatio: number;

  /** The rectangle describing the intersection between the target and root. */
  intersectionRect: DOMRectReadOnly;

  /** The bounding rectangle of the target element. */
  boundingClientRect: DOMRectReadOnly;

  /** The bounding rectangle of the root element. */
  rootBounds: DOMRectReadOnly | null;

  /** The time at which the intersection was recorded. */
  time: number;
}

/**
 * Return type for the useElementVisibility hook.
 */
export type UseElementVisibilityReturn<T extends Element = Element> = [
  (node: T | null) => void,
  boolean,
  IntersectionDetails | null
];