/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useCallback, useMemo } from 'react';

import type { UseFloatingFocusProps, UseFloatingFocusReturn } from './types';

/**
 * Provides focus interaction for floating elements.
 * @param props - Configuration options.
 * @returns Props to spread on reference and floating elements.
 */
export function useFloatingFocus(
  props: UseFloatingFocusProps
): UseFloatingFocusReturn {
  const { open, onOpenChange, enabled = true, visibleOnly = true } = props;

  const blockFocusRef = useRef(false);

  const handleFocus = useCallback(
    (e: React.FocusEvent) => {
      if (blockFocusRef.current) {
        blockFocusRef.current = false;
        return;
      }

      if (visibleOnly) {
        try {
          if (!e.currentTarget.matches(':focus-visible')) {
            return;
          }
        } catch {
          // :focus-visible not supported
        }
      }

      onOpenChange(true);
    },
    [visibleOnly, onOpenChange]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      const relatedTarget = e.relatedTarget as Element | null;
      const currentTarget = e.currentTarget as Element;

      if (relatedTarget && currentTarget.contains(relatedTarget)) {
        return;
      }

      onOpenChange(false);
    },
    [onOpenChange]
  );

  const handlePointerDown = useCallback(() => {
    blockFocusRef.current = true;
  }, []);

  const reference = useMemo(() => {
    if (!enabled) return {};

    return {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onPointerDown: handlePointerDown
    };
  }, [enabled, handleFocus, handleBlur, handlePointerDown]);

  return {
    reference,
    floating: {}
  };
}
