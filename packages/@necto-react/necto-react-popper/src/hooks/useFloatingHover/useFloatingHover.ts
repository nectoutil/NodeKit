/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useCallback, useMemo, useEffect } from 'react';

import type { UseFloatingHoverOptions, UseFloatingHoverReturn } from './types';

/**
 * Provides hover interaction with delay support for floating elements.
 * @param options - Configuration options.
 * @returns Props to spread on reference and floating elements.
 */
export function useFloatingHover(
  options: UseFloatingHoverOptions
): UseFloatingHoverReturn {
  const {
    open,
    onOpenChange,
    enabled = true,
    delay = 0,
    handleClose = true,
    mouseOnly = false,
    restMs = 0
  } = options;

  const openDelay = typeof delay === 'number' ? delay : (delay.open ?? 0);
  const closeDelay = typeof delay === 'number' ? delay : (delay.close ?? 0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blockMouseRef = useRef(false);
  const isHoveringRef = useRef(false);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (restTimeoutRef.current) {
      clearTimeout(restTimeoutRef.current);
      restTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const handleOpen = useCallback(() => {
    clearTimeouts();
    if (openDelay > 0) {
      timeoutRef.current = setTimeout(() => {
        onOpenChange(true);
      }, openDelay);
    } else {
      onOpenChange(true);
    }
  }, [openDelay, onOpenChange, clearTimeouts]);

  const handleClose_ = useCallback(() => {
    clearTimeouts();
    if (closeDelay > 0) {
      timeoutRef.current = setTimeout(() => {
        onOpenChange(false);
      }, closeDelay);
    } else {
      onOpenChange(false);
    }
  }, [closeDelay, onOpenChange, clearTimeouts]);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (mouseOnly && e.pointerType !== 'mouse') return;
      if (blockMouseRef.current && e.pointerType === 'mouse') return;

      isHoveringRef.current = true;
      handleOpen();
    },
    [mouseOnly, handleOpen]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (mouseOnly && e.pointerType !== 'mouse') return;

      isHoveringRef.current = false;

      if (restMs > 0) {
        restTimeoutRef.current = setTimeout(() => {
          if (!isHoveringRef.current) {
            handleClose_();
          }
        }, restMs);
      } else {
        handleClose_();
      }
    },
    [mouseOnly, restMs, handleClose_]
  );

  const handleTouchStart = useCallback(() => {
    blockMouseRef.current = true;
  }, []);

  const reference = useMemo(() => {
    if (!enabled) return {};

    return {
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onTouchStart: handleTouchStart
    };
  }, [enabled, handlePointerEnter, handlePointerLeave, handleTouchStart]);

  const floating = useMemo(() => {
    if (!enabled || !handleClose) return {};

    return {
      onPointerEnter: () => {
        isHoveringRef.current = true;
        clearTimeouts();
      },
      onPointerLeave: handlePointerLeave
    };
  }, [enabled, handleClose, clearTimeouts, handlePointerLeave]);

  return {
    reference,
    floating
  };
}
