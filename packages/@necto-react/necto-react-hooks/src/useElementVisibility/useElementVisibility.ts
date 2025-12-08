/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffectEvent } from '@necto-react/hooks';
import { useRef, useState, useCallback, useEffect } from 'react';

import type {
  UseElementVisibilityOptions,
  UseElementVisibilityReturn,
  IntersectionDetails
} from './useElementVisibility.types';

/**
 * React hook that observes the visibility of a DOM element using the Intersection Observer API.
 *
 * @template T The type of the element being observed.
 * @param {UseElementVisibilityOptions} [options] - Options to control visibility observation and callbacks.
 * @returns {UseElementVisibilityReturn<T>} A tuple containing the ref to the element, the visibility state, and intersection details.
 */
export function useElementVisibility<T extends Element = Element>(
  options: UseElementVisibilityOptions = {}
): UseElementVisibilityReturn<T> {
  const {
    partialVisibility = false,
    threshold = 0,
    rootMargin = '0px',
    root = null,
    active = true,
    once = false,
    onChange
  } = options;

  const [element, setElement] = useState<T | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [intersectionDetails, setIntersectionDetails] =
    useState<IntersectionDetails | null>(null);
  const hasBeenVisible = useRef<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Use useEffectEvent to create a stable reference that doesn't cause re-renders
  const handleIntersection = useEffectEvent(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      const visible = entry.isIntersecting;

      const details: IntersectionDetails = {
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        intersectionRect: entry.intersectionRect,
        boundingClientRect: entry.boundingClientRect,
        rootBounds: entry.rootBounds,
        time: entry.time
      };

      setIntersectionDetails(details);

      setIsVisible((prev) => {
        if (once && hasBeenVisible.current) {
          return true;
        }

        if (visible && once) {
          hasBeenVisible.current = true;
          if (prev !== true && onChange) onChange(true);
          return true;
        }

        if (prev !== visible) {
          if (onChange) onChange(visible);
          return visible;
        }

        return prev;
      });
    }
  );

  const nodeRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!active || !element) return;

    let observerThreshold: number | number[];

    if (partialVisibility === true) {
      observerThreshold = [0, 0.1, 0.25, 0.5, 0.75, 1];
    } else if (typeof partialVisibility === 'string') {
      observerThreshold = 0.01;
    } else {
      observerThreshold = threshold;
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold: observerThreshold
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // Notice: handleIntersection is no longer in the dependency array!
  }, [active, element, root, rootMargin, threshold, partialVisibility]);

  return [nodeRef, isVisible, intersectionDetails];
}
