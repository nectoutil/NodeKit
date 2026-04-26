/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLatestRef } from '../useLatestRef';
import { useResizeObserver } from '../useResizeObserver';

import type {
  UseOverflowReturn,
  UseOverflowOptions
} from './useOverflow.types';
import type { RefObject } from 'react';

/**
 * Stores partition state as a single COUNT (number of visible items), not
 * as arrays of item references. `visibleItems` and `hiddenItems` are derived
 * from the `items` prop + count at render time.
 *
 * Why: this decouples internal state from items prop identity. Consumers
 * that build their items array inline (`.map(...)` producing new objects on
 * every render, plain literals like `['a', 'b']`, etc.) used to either
 * (a) trigger a setState loop or (b) cause a flicker on every parent
 * re-render. With count-based state, items ref churn requires zero state
 * updates — partition only changes when the layout actually demands it.
 *
 * The same approach is used by react-overflow-list and similar libraries.
 */
export function useOverflow<T>({
  items,
  collapseFrom = 'end',
  minVisible = 1
}: UseOverflowOptions<T>): UseOverflowReturn<T> {
  const itemsRef: RefObject<ReadonlyArray<T>> = useLatestRef(items);
  const previousWidth: RefObject<number | null> = useRef<number | null>(null);
  const spacerRef: RefObject<HTMLElement | null> = useRef<HTMLElement | null>(
    null
  );
  const containerRef: RefObject<HTMLElement | null> =
    useRef<HTMLElement | null>(null);

  const [visibleCount, setVisibleCount] = useState<number>(items.length);
  const [isReady, setReady] = useState<boolean>(false);

  // Track length separately so we can detect "items added/removed" without
  // tracking item references (which would defeat the whole point).
  const previousLengthRef: RefObject<number> = useRef<number>(items.length);

  // Reset on length change. Length is the only signal we trust as "items
  // genuinely changed". Reference changes alone are no-ops; visibleItems /
  // hiddenItems are derived below from the latest items prop.
  useEffect((): void => {
    if (previousLengthRef.current === items.length) {
      return;
    }

    previousLengthRef.current = items.length;
    setVisibleCount(items.length);
    setReady(false);
    previousWidth.current = null;
  }, [items.length]);

  const splitFromStart: boolean = collapseFrom === 'start';

  // Memoize the slice operations so the returned arrays are stable across
  // renders when neither `items` nor `visibleCount` changed. Consumers can
  // safely use them in dep arrays without thrashing.
  const visibleItems: ReadonlyArray<T> = useMemo(
    (): ReadonlyArray<T> =>
      splitFromStart
        ? items.slice(items.length - visibleCount)
        : items.slice(0, visibleCount),
    [items, visibleCount, splitFromStart]
  );

  const hiddenItems: ReadonlyArray<T> = useMemo(
    (): ReadonlyArray<T> =>
      splitFromStart
        ? items.slice(0, items.length - visibleCount)
        : items.slice(visibleCount),
    [items, visibleCount, splitFromStart]
  );

  const repartition = useCallback(
    (isGrowing: boolean): void => {
      if (!spacerRef.current) {
        return;
      }

      if (isGrowing) {
        // Container grew: re-expand to all-visible and let the shrink loop
        // re-settle on the new equilibrium.
        setVisibleCount(itemsRef.current.length);
        return;
      }

      const spacerWidth: number =
        spacerRef.current.getBoundingClientRect().width;

      // Spacer has room → currently-visible items fit. Stop shrinking.
      if (spacerWidth >= 0.9) {
        return;
      }

      setVisibleCount((current: number): number =>
        current > minVisible ? current - 1 : current
      );
    },
    [minVisible, itemsRef]
  );

  // Re-run partition whenever the visible count changes. This is the
  // iterative-shrink loop: each render measures the spacer, removes one
  // item if needed, re-renders, re-measures, until the spacer fits.
  useEffect((): void => {
    repartition(false);

    if (!isReady) {
      setReady(true);
    }
  }, [visibleCount, repartition, isReady]);

  useResizeObserver(containerRef, (): void => {
    const containerElement: HTMLElement | null = containerRef.current;
    if (!containerElement) {
      return;
    }

    const currentWidth: number = containerElement.getBoundingClientRect().width;
    const recordedPreviousWidth: number | null = previousWidth.current;
    previousWidth.current = currentWidth;

    if (recordedPreviousWidth === null) {
      repartition(false);
      return;
    }

    repartition(currentWidth > recordedPreviousWidth);
  });

  return {
    isReady,
    spacerRef,
    containerRef,
    hiddenItems,
    visibleItems,
    hiddenCount: hiddenItems.length
  };
}
