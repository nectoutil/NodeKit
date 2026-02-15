/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use client';

import { defu } from 'defu';
import { mergeProps } from '@necto/mergers';
import { useCallback, useEffect, useRef } from 'react';
import { isCtrlKeyPressed, isMac } from '@necto/platform';
import { focusWithoutScrolling, scrollIntoView } from '@necto/dom';

import type { KeyboardEvent, FocusEvent, Key } from 'react';
import type {
  UseCollectionNavigationOptions,
  UseCollectionNavigationReturn,
  FocusStrategy
} from './useCollectionNavigation.types';

/**
 * Checks if a modifier key for non-contiguous selection is pressed.
 */
function isNonContiguousSelectionModifier(e: KeyboardEvent): boolean {
  return isMac() ? e.metaKey : e.ctrlKey;
}

/**
 * Gets the DOM element for a collection item by key.
 */
function getItemElement(
  ref: React.RefObject<HTMLElement | null>,
  key: Key
): HTMLElement | null {
  return ref.current?.querySelector(`[data-key="${key}"]`) ?? null;
}

/**
 * Handles keyboard navigation and selection for collections.
 * Supports lists, grids, tabs, menus, and other selectable collections.
 */
export function useCollectionNavigation(
  options: UseCollectionNavigationOptions
): UseCollectionNavigationReturn {
  const {
    selectionManager: manager,
    keyboardDelegate: delegate,
    ref,
    autoFocus,
    shouldFocusWrap,
    disallowEmptySelection,
    disallowSelectAll,
    escapeBehavior,
    selectOnFocus,
    disallowTypeAhead,
    shouldUseVirtualFocus,
    allowsTabNavigation,
    scrollRef,
    direction,
    orientation,
    onNavigate,
    onFocusItem
  } = defu(options, {
    autoFocus: false as const,
    shouldFocusWrap: false,
    disallowEmptySelection: false,
    disallowSelectAll: false,
    escapeBehavior: 'clearSelection' as const,
    selectOnFocus: false,
    disallowTypeAhead: false,
    shouldUseVirtualFocus: false,
    allowsTabNavigation: false,
    isVirtualized: false,
    direction: 'ltr' as const,
    orientation: 'vertical' as const
  });

  const effectiveScrollRef = scrollRef ?? ref;
  const scrollPos = useRef<{ top: number; left: number }>({ top: 0, left: 0 });
  const lastFocusedKey = useRef<Key | null>(manager.focusedKey);
  const autoFocusRef = useRef<boolean | FocusStrategy>(autoFocus);
  const typeAheadBuffer = useRef<string>('');
  const typeAheadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Navigate to a key and optionally select it.
   */
  const navigateToKey = useCallback(
    (
      key: Key | null | undefined,
      e?: KeyboardEvent,
      childFocus?: FocusStrategy
    ): void => {
      if (key == null) return;

      manager.setFocusedKey(key, childFocus);
      onNavigate?.(key);

      if (e?.shiftKey && manager.selectionMode === 'multiple') {
        manager.extendSelection(key);
      } else if (
        selectOnFocus &&
        !isNonContiguousSelectionModifier(e as KeyboardEvent)
      ) {
        manager.replaceSelection(key);
      }
    },
    [manager, selectOnFocus, onNavigate]
  );

  /**
   * Focus an item element.
   */
  const focusItem = useCallback(
    (key: Key): void => {
      if (onFocusItem) {
        onFocusItem(key);
        return;
      }

      const element: HTMLElement | null = getItemElement(ref, key);
      if (element && !shouldUseVirtualFocus) {
        focusWithoutScrolling(element);
      }
    },
    [ref, shouldUseVirtualFocus, onFocusItem]
  );

  /**
   * Handle keyboard navigation.
   */
  const onKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      // Handle type-ahead
      if (
        !disallowTypeAhead &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        if (typeAheadTimeout.current) {
          clearTimeout(typeAheadTimeout.current);
        }

        typeAheadBuffer.current += e.key;

        const key: Key | null =
          delegate.getKeyForSearch?.(
            typeAheadBuffer.current,
            manager.focusedKey
          ) ?? null;
        if (key != null) {
          e.preventDefault();
          navigateToKey(key, e);
        }

        typeAheadTimeout.current = setTimeout((): void => {
          typeAheadBuffer.current = '';
        }, 500);

        return;
      }

      const isRtl: boolean = direction === 'rtl';

      switch (e.key) {
        case 'ArrowDown': {
          if (delegate.getKeyBelow) {
            let nextKey: Key | null =
              manager.focusedKey != null
                ? delegate.getKeyBelow(manager.focusedKey)
                : (delegate.getFirstKey?.() ?? null);

            if (nextKey == null && shouldFocusWrap) {
              nextKey = delegate.getFirstKey?.() ?? null;
            }

            if (nextKey != null) {
              e.preventDefault();
              navigateToKey(nextKey, e);
            }
          }
          break;
        }

        case 'ArrowUp': {
          if (delegate.getKeyAbove) {
            let nextKey: Key | null =
              manager.focusedKey != null
                ? delegate.getKeyAbove(manager.focusedKey)
                : (delegate.getLastKey?.() ?? null);

            if (nextKey == null && shouldFocusWrap) {
              nextKey = delegate.getLastKey?.() ?? null;
            }

            if (nextKey != null) {
              e.preventDefault();
              navigateToKey(nextKey, e);
            }
          }
          break;
        }

        case 'ArrowLeft': {
          if (delegate.getKeyLeftOf) {
            let nextKey: Key | null =
              manager.focusedKey != null
                ? delegate.getKeyLeftOf(manager.focusedKey)
                : null;

            if (nextKey == null && shouldFocusWrap) {
              nextKey = isRtl
                ? (delegate.getFirstKey?.() ?? null)
                : (delegate.getLastKey?.() ?? null);
            }

            if (nextKey != null) {
              e.preventDefault();
              navigateToKey(nextKey, e, isRtl ? 'first' : 'last');
            }
          }
          break;
        }

        case 'ArrowRight': {
          if (delegate.getKeyRightOf) {
            let nextKey: Key | null =
              manager.focusedKey != null
                ? delegate.getKeyRightOf(manager.focusedKey)
                : null;

            if (nextKey == null && shouldFocusWrap) {
              nextKey = isRtl
                ? (delegate.getLastKey?.() ?? null)
                : (delegate.getFirstKey?.() ?? null);
            }

            if (nextKey != null) {
              e.preventDefault();
              navigateToKey(nextKey, e, isRtl ? 'last' : 'first');
            }
          }
          break;
        }

        case 'Home': {
          if (delegate.getFirstKey) {
            e.preventDefault();
            const firstKey: Key | null = delegate.getFirstKey();
            manager.setFocusedKey(firstKey);

            if (firstKey != null) {
              if (
                isCtrlKeyPressed(e) &&
                e.shiftKey &&
                manager.selectionMode === 'multiple'
              ) {
                manager.extendSelection(firstKey);
              } else if (selectOnFocus) {
                manager.replaceSelection(firstKey);
              }
            }
          }
          break;
        }

        case 'End': {
          if (delegate.getLastKey) {
            e.preventDefault();
            const lastKey: Key | null = delegate.getLastKey();
            manager.setFocusedKey(lastKey);

            if (lastKey != null) {
              if (
                isCtrlKeyPressed(e) &&
                e.shiftKey &&
                manager.selectionMode === 'multiple'
              ) {
                manager.extendSelection(lastKey);
              } else if (selectOnFocus) {
                manager.replaceSelection(lastKey);
              }
            }
          }
          break;
        }

        case 'PageDown': {
          if (delegate.getKeyPageBelow && manager.focusedKey != null) {
            const nextKey: Key | null = delegate.getKeyPageBelow(
              manager.focusedKey
            );
            if (nextKey != null) {
              e.preventDefault();
              navigateToKey(nextKey, e);
            }
          }
          break;
        }

        case 'PageUp': {
          if (delegate.getKeyPageAbove && manager.focusedKey != null) {
            const nextKey: Key | null = delegate.getKeyPageAbove(
              manager.focusedKey
            );
            if (nextKey != null) {
              e.preventDefault();
              navigateToKey(nextKey, e);
            }
          }
          break;
        }

        case 'a': {
          if (
            isCtrlKeyPressed(e) &&
            manager.selectionMode === 'multiple' &&
            !disallowSelectAll
          ) {
            e.preventDefault();
            manager.selectAll();
          }
          break;
        }

        case 'Escape': {
          if (
            escapeBehavior === 'clearSelection' &&
            !disallowEmptySelection &&
            manager.selectedKeys.size > 0
          ) {
            e.stopPropagation();
            e.preventDefault();
            manager.clearSelection();
          }
          break;
        }

        case 'Tab': {
          if (!allowsTabNavigation && ref.current) {
            if (e.shiftKey) {
              ref.current.focus();
            }
          }
          break;
        }
      }
    },
    [
      delegate,
      manager,
      ref,
      direction,
      shouldFocusWrap,
      selectOnFocus,
      disallowTypeAhead,
      disallowSelectAll,
      disallowEmptySelection,
      escapeBehavior,
      allowsTabNavigation,
      navigateToKey
    ]
  );

  /**
   * Handle focus entering the collection.
   */
  const onFocus = useCallback(
    (e: FocusEvent): void => {
      if (manager.isFocused) return;

      manager.setFocused(true);

      if (manager.focusedKey == null) {
        // Determine if tabbing forward or backward
        const relatedTarget = e.relatedTarget as Element | null;
        const isBackward: boolean =
          relatedTarget != null &&
          Boolean(
            e.currentTarget.compareDocumentPosition(relatedTarget) &
              Node.DOCUMENT_POSITION_FOLLOWING
          );

        let keyToFocus: Key | null = null;

        if (isBackward) {
          keyToFocus =
            manager.lastSelectedKey ?? delegate.getLastKey?.() ?? null;
        } else {
          keyToFocus =
            manager.firstSelectedKey ?? delegate.getFirstKey?.() ?? null;
        }

        if (keyToFocus != null) {
          manager.setFocusedKey(keyToFocus);
          if (selectOnFocus && !manager.isSelected(keyToFocus)) {
            manager.replaceSelection(keyToFocus);
          }
        }
      } else if (effectiveScrollRef.current) {
        // Restore scroll position
        effectiveScrollRef.current.scrollTop = scrollPos.current.top;
        effectiveScrollRef.current.scrollLeft = scrollPos.current.left;
      }

      // Focus the item element
      if (manager.focusedKey != null) {
        focusItem(manager.focusedKey);
      }
    },
    [manager, delegate, selectOnFocus, effectiveScrollRef, focusItem]
  );

  /**
   * Handle focus leaving the collection.
   */
  const onBlur = useCallback(
    (e: FocusEvent): void => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      const currentTarget = e.currentTarget as HTMLElement;

      // Only blur if focus is leaving the collection entirely
      if (!currentTarget.contains(relatedTarget)) {
        manager.setFocused(false);
      }
    },
    [manager]
  );

  /**
   * Prevent focus on scrollbar click.
   */
  const onMouseDown = useCallback(
    (e: React.MouseEvent): void => {
      if (effectiveScrollRef.current === e.target) {
        e.preventDefault();
      }
    },
    [effectiveScrollRef]
  );

  // Track scroll position
  useEffect((): (() => void) => {
    const scrollElement = effectiveScrollRef.current;
    if (!scrollElement) return () => {};

    const handleScroll = (): void => {
      scrollPos.current = {
        top: scrollElement.scrollTop,
        left: scrollElement.scrollLeft
      };
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return (): void => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [effectiveScrollRef]);

  // Auto-focus on mount
  useEffect((): void => {
    if (!autoFocusRef.current) return;

    let focusedKey: Key | null = null;

    if (autoFocusRef.current === 'first') {
      focusedKey = delegate.getFirstKey?.() ?? null;
    } else if (autoFocusRef.current === 'last') {
      focusedKey = delegate.getLastKey?.() ?? null;
    }

    // Focus first selected key if any
    if (manager.selectedKeys.size > 0) {
      for (const key of manager.selectedKeys) {
        if (manager.canSelectItem?.(key) !== false) {
          focusedKey = key;
          break;
        }
      }
    }

    manager.setFocused(true);
    manager.setFocusedKey(focusedKey);

    if (focusedKey == null && !shouldUseVirtualFocus && ref.current) {
      ref.current.focus();
    }

    autoFocusRef.current = false;
  }, [delegate, manager, ref, shouldUseVirtualFocus]);

  // Scroll focused item into view
  useEffect((): void => {
    if (!manager.isFocused || manager.focusedKey == null) return;
    if (manager.focusedKey === lastFocusedKey.current) return;

    const element: HTMLElement | null = getItemElement(ref, manager.focusedKey);
    if (element && effectiveScrollRef.current) {
      scrollIntoView(effectiveScrollRef.current, element);
    }

    lastFocusedKey.current = manager.focusedKey;
  }, [manager.isFocused, manager.focusedKey, ref, effectiveScrollRef]);

  // Clean up type-ahead timeout
  useEffect((): (() => void) => {
    return (): void => {
      if (typeAheadTimeout.current) {
        clearTimeout(typeAheadTimeout.current);
      }
    };
  }, []);

  // Compute tabIndex
  const tabIndex: number | undefined = shouldUseVirtualFocus
    ? undefined
    : manager.focusedKey == null
      ? 0
      : -1;

  return {
    collectionProps: mergeProps({
      onKeyDown,
      onFocus,
      onBlur,
      onMouseDown,
      tabIndex,
      'data-orientation': orientation
    })
  };
}
