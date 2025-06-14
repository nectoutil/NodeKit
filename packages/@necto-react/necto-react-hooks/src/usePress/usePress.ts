/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  getOwnerWindow,
  disableTextSelection,
  restoreTextSelection
} from '@necto/dom';

import type { PointerType, PressEvent } from '@necto/types';
import type { UsePressProps, UsePressReturn } from './usePress.types';

/**
 * Creates a standardized PressEvent object from a native event.
 *
 * @param {string} type - The type of press event (e.g., "pressstart", "pressend", "press").
 * @param {PointerType} pointerType - The type of pointer device that triggered the event (e.g., "mouse", "touch", "keyboard").
 * @param {any} event - The original event object (MouseEvent, TouchEvent, or KeyboardEvent).
 * @returns {PressEvent} A normalized PressEvent containing event metadata and modifier keys.
 */
function createPressEvent(
  type: string,
  pointerType: PointerType,
  event: MouseEvent | TouchEvent | KeyboardEvent
): PressEvent {
  return {
    type,
    pointerType,
    target: (event.currentTarget ?? event.target) as EventTarget,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    altKey: event.altKey
  };
}

/**
 * Provides press (mouse, touch, keyboard) interaction logic for UI components.
 * Handles accessibility, text selection, and emulated event quirks for consistent press behavior.
 *
 * @param {UsePressProps} props - Configuration options and event handlers for the press interaction.
 * @returns {UsePressReturn} An object containing press event props to spread onto your element and the current pressed state.
 */
export function usePress(props: UsePressProps = {}): UsePressReturn {
  const {
    isDisabled,
    preventFocusOnPress,
    allowTextSelectionOnPress,
    ref: domRef,

    // Callbacks
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    onClick
  } = props;

  const [isPressed, setPressed] = useState(false);
  const ignoreEmulatedMouseEvents = useRef(false);
  const target = useRef<EventTarget | null>(null);
  const pressStarted = useRef(false);

  // Helper to update pressed state and call onPressChange
  const setIsPressed = useCallback(
    (pressed: boolean) => {
      if (isPressed !== pressed) {
        setPressed(pressed);
        onPressChange?.(pressed);
      }
    },
    [isPressed, onPressChange]
  );

  // --- Mouse Up on Window Handler ---
  const onMouseUpWin = useCallback(
    (e: MouseEvent) => {
      if (!pressStarted.current) return;

      const isPressedOver =
        target.current &&
        target.current instanceof Node &&
        e.target instanceof Node &&
        target.current.contains(e.target);

      pressStarted.current = false;
      setIsPressed(false);

      // Restore text selection
      if (!allowTextSelectionOnPress && target.current instanceof HTMLElement) {
        restoreTextSelection(target.current);
      }

      // Ensure target is not null for PressEvent typing
      if (e.target) {
        const evt = {
          ...createPressEvent('pressend', 'mouse', e),
          target: e.target as EventTarget
        };

        onPressEnd?.(evt);
        onPressUp?.(evt);

        if (isPressedOver) {
          onPress?.(evt);
        }
      }
    },
    [onPressEnd, onPressUp, onPress, setIsPressed, allowTextSelectionOnPress]
  );

  // --- Mouse Down Handler ---
  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (isDisabled || e.button !== 0) return;
      if (ignoreEmulatedMouseEvents.current) return;

      // Prevent focus if requested
      if (preventFocusOnPress) {
        e.preventDefault();
      }

      // Disable text selection if not allowed
      if (!allowTextSelectionOnPress) {
        disableTextSelection(e.currentTarget as HTMLElement);
      }

      pressStarted.current = true;
      target.current = e.currentTarget;
      setIsPressed(true);

      const evt = createPressEvent('pressstart', 'mouse', e);
      onPressStart?.(evt);

      window.addEventListener('mouseup', onMouseUpWin, { once: true });
    },
    [
      isDisabled,
      preventFocusOnPress,
      allowTextSelectionOnPress,
      onPressStart,
      setIsPressed,
      onMouseUpWin
    ]
  );

  // --- Mouse Up Handler ---
  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDisabled || e.button !== 0 || !pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      // Restore text selection
      if (
        !allowTextSelectionOnPress &&
        e.currentTarget instanceof HTMLElement
      ) {
        restoreTextSelection(e.currentTarget);
      }

      const evt = createPressEvent('pressend', 'mouse', e);
      onPressEnd?.(evt);
      onPressUp?.(evt);

      if (
        e.currentTarget instanceof Node &&
        e.currentTarget.contains(e.target as Node)
      ) {
        onPress?.(createPressEvent('press', 'mouse', e));
      }
    },
    [
      isDisabled,
      onPress,
      onPressEnd,
      onPressUp,
      setIsPressed,
      allowTextSelectionOnPress
    ]
  );

  // --- Mouse Leave Handler ---
  const onMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (isPressed) {
        setIsPressed(false);
        onPressEnd?.(createPressEvent('pressend', 'mouse', e));
        // Restore text selection if needed
        if (
          !allowTextSelectionOnPress &&
          e.currentTarget instanceof HTMLElement
        ) {
          restoreTextSelection(e.currentTarget);
        }
      }
    },
    [isPressed, setIsPressed, onPressEnd, allowTextSelectionOnPress]
  );

  // --- Mouse Enter Handler ---
  const onMouseEnter = useCallback(
    (e: MouseEvent) => {
      if (pressStarted.current && !isPressed) {
        setIsPressed(true);
        onPressStart?.(createPressEvent('pressstart', 'mouse', e));
      }
    },
    [isPressed, onPressStart, setIsPressed]
  );

  // --- Touch End on Window Handler ---
  const onTouchEndWin = useCallback(
    (e: TouchEvent) => {
      if (!pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      // Restore text selection
      if (!allowTextSelectionOnPress && target.current instanceof HTMLElement) {
        restoreTextSelection(target.current);
      }

      const evt = {
        ...createPressEvent('pressend', 'touch', e),
        target: e.target
      };

      onPressEnd?.(evt as PressEvent);
      onPressUp?.(evt as PressEvent);
    },
    [onPressEnd, onPressUp, setIsPressed, allowTextSelectionOnPress]
  );

  // --- Touch Cancel on Window Handler ---
  const onTouchCancelWin = useCallback(
    (e: TouchEvent) => {
      if (!pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      // Restore text selection
      if (!allowTextSelectionOnPress && target.current instanceof HTMLElement) {
        restoreTextSelection(target.current);
      }

      const evt = {
        ...createPressEvent('pressend', 'touch', e),
        target: e.target
      };

      onPressEnd?.(evt as PressEvent);
    },
    [onPressEnd, setIsPressed, allowTextSelectionOnPress]
  );

  // --- Touch Start Handler ---
  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isDisabled) return;

      // Disable text selection if not allowed
      if (!allowTextSelectionOnPress) {
        disableTextSelection(e.currentTarget as HTMLElement);
      }

      // Prevent emulated mouse events
      ignoreEmulatedMouseEvents.current = true;
      setTimeout(() => {
        ignoreEmulatedMouseEvents.current = false;
      }, 100);

      pressStarted.current = true;
      target.current = e.currentTarget;
      setIsPressed(true);

      onPressStart?.(createPressEvent('pressstart', 'touch', e));

      window.addEventListener('touchend', onTouchEndWin, { once: true });
      window.addEventListener('touchcancel', onTouchCancelWin, {
        once: true
      });
    },
    [
      isDisabled,
      onPressStart,
      setIsPressed,
      allowTextSelectionOnPress,
      onTouchEndWin,
      onTouchCancelWin
    ]
  );

  // --- On Touch End Handler ---
  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (isDisabled || !pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      // Restore text selection
      if (
        !allowTextSelectionOnPress &&
        e.currentTarget instanceof HTMLElement
      ) {
        restoreTextSelection(e.currentTarget);
      }

      const evt = createPressEvent('pressend', 'touch', e);
      onPressEnd?.(evt);
      onPressUp?.(evt);

      if (
        e.currentTarget instanceof Node &&
        e.currentTarget.contains(e.target as Node)
      ) {
        onPress?.(createPressEvent('press', 'touch', e));
      }
    },
    [
      isDisabled,
      onPress,
      onPressEnd,
      onPressUp,
      setIsPressed,
      allowTextSelectionOnPress
    ]
  );

  // --- Keyboard Key Down Handler ---
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isDisabled) return;

      const isValidKey = e.key === 'Enter' || e.key === ' ';
      if (isValidKey && !isPressed) {
        // Prevent scrolling with spacebar
        if (e.key === ' ') {
          e.preventDefault();
        }

        // Disable text selection if not allowed
        if (!allowTextSelectionOnPress) {
          disableTextSelection();
        }

        setIsPressed(true);
        pressStarted.current = true;
        onPressStart?.(createPressEvent('pressstart', 'keyboard', e));
      }
    },
    [
      isDisabled,
      isPressed,
      onPressStart,
      setIsPressed,
      allowTextSelectionOnPress
    ]
  );

  // --- Keyboard Key Up Handler ---
  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (isDisabled) return;

      const isValidKey = e.key === 'Enter' || e.key === ' ';
      if (isValidKey && isPressed) {
        setIsPressed(false);
        pressStarted.current = false;

        // Restore text selection if not allowed
        if (!allowTextSelectionOnPress) {
          restoreTextSelection();
        }

        const evt = createPressEvent('pressend', 'keyboard', e);
        onPressEnd?.(evt);
        onPressUp?.(createPressEvent('pressup', 'keyboard', e));
        onPress?.(createPressEvent('press', 'keyboard', e));
      }
    },
    [
      isDisabled,
      isPressed,
      onPress,
      onPressEnd,
      onPressUp,
      setIsPressed,
      allowTextSelectionOnPress
    ]
  );

  // --- Click Handler (for compatibility) ---
  const onClickHandler = useCallback(
    (e: MouseEvent) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }

      // If we've already handled the press via other events,
      // don't trigger the click handler again
      if (!ignoreEmulatedMouseEvents.current) {
        onClick?.(e);
      }
    },
    [isDisabled, onClick]
  );

  useEffect(() => {
    return () => {
      window.removeEventListener('mouseup', onMouseUpWin);
      window.removeEventListener('touchend', onTouchEndWin);
      window.removeEventListener('touchcancel', onTouchCancelWin);
    };
  }, [onMouseUpWin, onTouchEndWin, onTouchCancelWin]);

  // Construct returnable and memoized press props
  const pressProps = useMemo(
    () => ({
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onMouseEnter,
      onTouchStart,
      onTouchEnd,
      onKeyDown,
      onKeyUp,
      onClick: onClickHandler
    }),
    [
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onMouseEnter,
      onTouchStart,
      onTouchEnd,
      onKeyDown,
      onKeyUp,
      onClickHandler
    ]
  );

  useEffect(() => {
    const element = domRef?.current;
    if (element && element instanceof getOwnerWindow(element).Element) {
      const style = getOwnerWindow(element).getComputedStyle(element);
      if (style.touchAction === 'auto') {
        (element as HTMLElement).style.touchAction = 'pan-x pan-y pinch-zoom';
      }
    }
  }, [domRef]);

  return { pressProps, isPressed };
}
