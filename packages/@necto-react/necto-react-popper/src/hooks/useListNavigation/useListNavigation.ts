/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useRef } from 'react';

import type {
  UseListNavigationOptions,
  UseListNavigationReturn
} from './types';

/**
 * Provides keyboard navigation for list-based floating elements.
 * @param options - Configuration options.
 * @returns Props to spread on reference, floating, and item elements.
 */
export function useListNavigation(
  options: UseListNavigationOptions
): UseListNavigationReturn {
  const {
    open,
    onOpenChange,
    listRef,
    activeIndex,
    onNavigate,
    enabled = true,
    virtual = false,
    loop = false,
    orientation = 'vertical',
    focusItemOnHover = true,
    openOnArrowKeyDown = true
  } = options;

  const indexRef = useRef(activeIndex);
  indexRef.current = activeIndex;

  const getNextIndex = useCallback(
    (current: number | null, direction: 1 | -1): number | null => {
      const items = listRef.current.filter(Boolean);
      const itemCount = items.length;

      if (itemCount === 0) return null;

      const currentIndex = current ?? (direction === 1 ? -1 : itemCount);
      let nextIndex = currentIndex + direction;

      if (loop) {
        if (nextIndex < 0) nextIndex = itemCount - 1;
        if (nextIndex >= itemCount) nextIndex = 0;
      } else {
        if (nextIndex < 0 || nextIndex >= itemCount) return current;
      }

      return nextIndex;
    },
    [listRef, loop]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;

      const isVertical = orientation === 'vertical' || orientation === 'both';
      const isHorizontal =
        orientation === 'horizontal' || orientation === 'both';

      const arrowUp = isVertical && e.key === 'ArrowUp';
      const arrowDown = isVertical && e.key === 'ArrowDown';
      const arrowLeft = isHorizontal && e.key === 'ArrowLeft';
      const arrowRight = isHorizontal && e.key === 'ArrowRight';

      if (arrowUp || arrowDown || arrowLeft || arrowRight) {
        e.preventDefault();

        if (!open && openOnArrowKeyDown) {
          onOpenChange(true);
          return;
        }

        const direction = arrowUp || arrowLeft ? -1 : 1;
        const nextIndex = getNextIndex(indexRef.current, direction);

        onNavigate(nextIndex);

        if (!virtual && nextIndex !== null) {
          const item = listRef.current[nextIndex];
          item?.focus();
        }
      }

      if (e.key === 'Home') {
        e.preventDefault();
        onNavigate(0);
        if (!virtual) {
          listRef.current[0]?.focus();
        }
      }

      if (e.key === 'End') {
        e.preventDefault();
        const lastIndex = listRef.current.filter(Boolean).length - 1;
        onNavigate(lastIndex);
        if (!virtual) {
          listRef.current[lastIndex]?.focus();
        }
      }
    },
    [
      enabled,
      open,
      onOpenChange,
      orientation,
      openOnArrowKeyDown,
      getNextIndex,
      onNavigate,
      virtual,
      listRef
    ]
  );

  const reference = useMemo(() => {
    if (!enabled) return {};

    return {
      onKeyDown: handleKeyDown,
      'aria-activedescendant':
        virtual && activeIndex !== null
          ? listRef.current[activeIndex]?.id
          : undefined
    };
  }, [enabled, handleKeyDown, virtual, activeIndex, listRef]);

  const floating = useMemo(() => {
    if (!enabled) return {};

    return {
      onKeyDown: handleKeyDown
    };
  }, [enabled, handleKeyDown]);

  const item = useMemo(() => {
    if (!enabled) return {};

    return {
      onPointerEnter: focusItemOnHover
        ? (e: React.PointerEvent) => {
            const target = e.currentTarget as HTMLElement;
            const index = listRef.current.indexOf(target);
            if (index !== -1) {
              onNavigate(index);
            }
          }
        : undefined,
      onPointerLeave: focusItemOnHover
        ? () => {
            onNavigate(null);
          }
        : undefined
    };
  }, [enabled, focusItemOnHover, listRef, onNavigate]);

  return {
    reference,
    floating,
    item
  };
}
