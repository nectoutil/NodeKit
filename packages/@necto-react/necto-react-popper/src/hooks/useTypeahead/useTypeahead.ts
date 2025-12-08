/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';

import type { UseTypeaheadProps, UseTypeaheadReturn } from './types';

function defaultFindMatch(
  list: Array<HTMLElement | null>,
  search: string
): number | null {
  const lowercaseSearch = search.toLowerCase();

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item) continue;

    const text = item.textContent?.toLowerCase() ?? '';
    if (text.startsWith(lowercaseSearch)) {
      return i;
    }
  }

  return null;
}

/**
 * Provides typeahead search for list-based floating elements.
 * @param props - Configuration options.
 * @returns Props to spread on reference and floating elements.
 */
export function useTypeahead(props: UseTypeaheadProps): UseTypeaheadReturn {
  const {
    open,
    listRef,
    activeIndex,
    onMatch,
    enabled = true,
    findMatch = defaultFindMatch,
    resetMs = 750,
    onTypingChange
  } = props;

  const searchRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevIndexRef = useRef<number | null>(activeIndex);

  useEffect(() => {
    if (!open) {
      searchRef.current = '';
    }
  }, [open]);

  const clearSearch = useCallback(() => {
    searchRef.current = '';
    onTypingChange?.(false);
  }, [onTypingChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled || !open) return;

      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      searchRef.current += e.key;
      onTypingChange?.(true);

      timeoutRef.current = setTimeout(clearSearch, resetMs);

      const matchIndex = findMatch(listRef.current, searchRef.current);

      if (matchIndex !== null && matchIndex !== prevIndexRef.current) {
        prevIndexRef.current = matchIndex;
        onMatch(matchIndex);
      }
    },
    [
      enabled,
      open,
      findMatch,
      listRef,
      onMatch,
      resetMs,
      clearSearch,
      onTypingChange
    ]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reference = useMemo(() => {
    if (!enabled) return {};

    return {
      onKeyDown: handleKeyDown
    };
  }, [enabled, handleKeyDown]);

  const floating = useMemo(() => {
    if (!enabled) return {};

    return {
      onKeyDown: handleKeyDown
    };
  }, [enabled, handleKeyDown]);

  return {
    reference,
    floating
  };
}
