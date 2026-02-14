/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
 */

import { defu } from 'defu';
import { useRef, useCallback, useEffect } from 'react';

import { DEFAULT_LONG_PRESS_THRESHOLD } from './constants';

import type { PointerType } from '@necto/types';
import type {
  LongPressEvent,
  UseLongPressOptions,
  UseLongPressReturn
} from './useLongPress.types';

/**
 * Handles long press interactions for touch and pointer devices.
 * A long press is triggered when the user holds down a pointer for a specified duration.
 */
export function useLongPress(
  options: UseLongPressOptions = {}
): UseLongPressReturn {
  const {
    isDisabled,
    onLongPressStart,
    onLongPressEnd,
    onLongPress,
    accessibilityDescription,
    threshold
  } = defu(options, {
    threshold: DEFAULT_LONG_PRESS_THRESHOLD
  }) as UseLongPressOptions;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerTypeRef = useRef<PointerType | null>(null);
  const targetRef = useRef<EventTarget | null>(null);
  const didFireRef = useRef<boolean>(false);

  const cancelTimeout = useCallback((): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => cancelTimeout, [cancelTimeout]);

  const createEvent = useCallback(
    (type: LongPressEvent['type']): LongPressEvent => ({
      type,
      pointerType: pointerTypeRef.current ?? 'mouse',
      target: targetRef.current!
    }),
    []
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent): void => {
      if (isDisabled || e.button !== 0) return;

      // Only handle touch and pen for long press (not mouse)
      if (e.pointerType === 'mouse') return;

      pointerTypeRef.current = e.pointerType as PointerType;
      targetRef.current = e.currentTarget;
      didFireRef.current = false;

      onLongPressStart?.(createEvent('longpressstart'));

      timeoutRef.current = setTimeout((): void => {
        didFireRef.current = true;

        // Dispatch pointercancel to prevent other interactions
        const target = e.currentTarget as HTMLElement;
        target?.dispatchEvent(
          new PointerEvent('pointercancel', { bubbles: true })
        );

        onLongPress?.(createEvent('longpress'));

        timeoutRef.current = null;
      }, threshold);
    },
    [isDisabled, threshold, onLongPressStart, onLongPress, createEvent]
  );

  const onPointerUp = useCallback((): void => {
    if (pointerTypeRef.current === null) return;

    cancelTimeout();

    if (!didFireRef.current && onLongPressEnd) {
      onLongPressEnd(createEvent('longpressend'));
    }

    pointerTypeRef.current = null;
    targetRef.current = null;
  }, [cancelTimeout, onLongPressEnd, createEvent]);

  const onPointerCancel = useCallback((): void => {
    cancelTimeout();

    if (pointerTypeRef.current !== null && onLongPressEnd) {
      onLongPressEnd(createEvent('longpressend'));
    }

    pointerTypeRef.current = null;
    targetRef.current = null;
  }, [cancelTimeout, onLongPressEnd, createEvent]);

  // Prevent context menu on long press for touch devices
  const onContextMenu = useCallback((e: React.MouseEvent): void => {
    if (didFireRef.current) {
      e.preventDefault();
    }
  }, []);

  // Only add accessibility description if long press is enabled and has a handler
  const shouldAddDescription: boolean =
    !isDisabled && !!onLongPress && !!accessibilityDescription;

  const longPressProps: UseLongPressReturn['longPressProps'] = isDisabled
    ? {}
    : {
        onPointerDown,
        onPointerUp,
        onPointerCancel,
        onContextMenu,
        ...(shouldAddDescription && {
          'aria-description': accessibilityDescription
        })
      };

  return { longPressProps };
}
