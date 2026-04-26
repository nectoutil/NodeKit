/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLatestRef } from '../useLatestRef';
import { useResizeObserver } from '../useResizeObserver';

import type {
  PartitionState,
  UseOverflowReturn,
  UseOverflowOptions
} from './useOverflow.types';
import type { RefObject } from 'react';

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
  const lastResetItemsRef: RefObject<ReadonlyArray<T>> =
    useRef<ReadonlyArray<T>>(items);

  const [state, setState] = useState<PartitionState<T>>({
    hidden: [],
    visible: items,
    lastOverflowCount: 0,
    overflowDirection: 'none'
  });

  const [isReady, setReady] = useState<boolean>(false);
  useEffect((): void => {
    const previous: ReadonlyArray<T> = lastResetItemsRef.current;

    if (previous === items) {
      return;
    }

    if (previous.length === items.length) {
      let isContentEqual: boolean = true;
      for (let index: number = 0; index < items.length; index += 1) {
        if (previous[index] !== items[index]) {
          isContentEqual = false;
          break;
        }
      }

      if (isContentEqual) {
        return;
      }
    }

    lastResetItemsRef.current = items;

    setState({
      hidden: [],
      visible: items,
      lastOverflowCount: 0,
      overflowDirection: 'none'
    });

    setReady(false);
    previousWidth.current = null;
  }, [items]);

  const repartition = useCallback(
    (isGrowing: boolean): void => {
      if (!spacerRef.current) {
        return;
      }

      if (isGrowing) {
        setState((current: PartitionState<T>) => ({
          visible: itemsRef.current,
          hidden: [],
          lastOverflowCount:
            current.overflowDirection === 'none'
              ? current.hidden.length
              : current.lastOverflowCount,
          overflowDirection: 'grow'
        }));

        return;
      }

      const spacerWidth: number =
        spacerRef.current.getBoundingClientRect().width;

      if (spacerWidth >= 0.9) {
        setState(
          (current: PartitionState<T>): PartitionState<T> =>
            current.overflowDirection === 'none'
              ? current
              : { ...current, overflowDirection: 'none' }
        );

        return;
      }

      setState((current: PartitionState<T>): PartitionState<T> => {
        if (current.visible.length <= minVisible) {
          return current;
        }

        const collapseFromStart: boolean = collapseFrom === 'start';
        const nextVisible: Array<T> = current.visible.slice();
        const movedItem: T | undefined = collapseFromStart
          ? nextVisible.shift()
          : nextVisible.pop();

        if (movedItem === undefined) {
          return current;
        }

        const nextHidden: Array<T> = collapseFromStart
          ? [...current.hidden, movedItem]
          : [movedItem, ...current.hidden];

        return {
          ...current,
          visible: nextVisible,
          hidden: nextHidden,
          overflowDirection:
            current.overflowDirection === 'none'
              ? 'shrink'
              : current.overflowDirection
        };
      });
    },
    [collapseFrom, minVisible, itemsRef]
  );

  useEffect(() => {
    repartition(false);

    if (!isReady) {
      setReady(true);
    }
  }, [state.visible, repartition, isReady]);

  useResizeObserver(containerRef, () => {
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
    hiddenItems: state.hidden,
    visibleItems: state.visible,
    hiddenCount: state.hidden.length
  };
}
