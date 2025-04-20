/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { useRef, useMemo, useState, useCallback, useEffect } from "react";

import type { MouseEvent, RefObject, KeyboardEvent } from "react";

export type PointerType = "mouse" | "touch" | "keyboard" | "pen" | "virtual";

export interface PressEvent {
  type: string;
  pointerType: PointerType;
  target: EventTarget;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export interface UsePressProps {
  isDisabled?: boolean;
  onPress?: (e: PressEvent) => void;
  onPressStart?: (e: PressEvent) => void;
  onPressEnd?: (e: PressEvent) => void;
  onPressChange?: (isPressed: boolean) => void;
  onPressUp?: (e: PressEvent) => void;
  onClick?: (e: MouseEvent) => void;
  preventFocusOnPress?: boolean;
  ref?: RefObject<HTMLElement>;
}

function createPressEvent(
  type: string,
  pointerType: PointerType,
  event: any
): PressEvent {
  return {
    type,
    pointerType,
    target: event.currentTarget || event.target,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    altKey: event.altKey,
  };
}

export function usePress(props: UsePressProps) {
  const {
    isDisabled,
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    onClick,
    preventFocusOnPress,
    ref,
  } = props;

  const [isPressed, setPressed] = useState(false);
  const ignoreEmulatedMouseEvents = useRef(false);
  const target = useRef<EventTarget | null>(null);
  const pressStarted = useRef(false);

  // Helper to call onPressChange only when state changes
  const setIsPressed = useCallback(
    (pressed: boolean) => {
      if (isPressed !== pressed) {
        setPressed(pressed);
        onPressChange?.(pressed);
      }
    },
    [isPressed, onPressChange]
  );

  // Mouse
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isDisabled || e.button !== 0) return;
      if (ignoreEmulatedMouseEvents.current) return;

      // Prevent focus if requested
      if (preventFocusOnPress) {
        e.preventDefault();
      }

      pressStarted.current = true;
      target.current = e.currentTarget;
      setIsPressed(true);

      const evt = createPressEvent("pressstart", "mouse", e);
      onPressStart?.(evt);

      // Add global listeners
      window.addEventListener("mouseup", onMouseUpWin, { once: true });
    },
    [isDisabled, onPressStart, preventFocusOnPress, setIsPressed]
  );

  const onMouseUpWin = useCallback(
    (e: MouseEvent) => {
      if (!pressStarted.current) return;

      const isPressedOver = target.current &&
        target.current instanceof Node &&
        e.target instanceof Node &&
        target.current.contains(e.target);

      pressStarted.current = false;
      setIsPressed(false);

      // Create event
      const evt = {
        ...createPressEvent("pressend", "mouse", e),
        target: e.target,
      };

      onPressEnd?.(evt);
      onPressUp?.(evt);

      // Only trigger press if released over the target
      if (isPressedOver) {
        onPress?.(evt);
      }
    },
    [onPressEnd, onPressUp, onPress, setIsPressed]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDisabled || e.button !== 0 || !pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      const evt = createPressEvent("pressend", "mouse", e);
      onPressEnd?.(evt);
      onPressUp?.(evt);

      if (e.currentTarget.contains(e.target as Node)) {
        onPress?.(createPressEvent("press", "mouse", e));
      }
    },
    [isDisabled, onPress, onPressEnd, onPressUp, setIsPressed]
  );

  const onMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (isPressed) {
        setIsPressed(false);
        onPressEnd?.(createPressEvent("pressend", "mouse", e));
      }
    },
    [isPressed, setIsPressed, onPressEnd]
  );

  const onMouseEnter = useCallback(
    (e: MouseEvent) => {
      if (pressStarted.current && !isPressed) {
        setIsPressed(true);
        onPressStart?.(createPressEvent("pressstart", "mouse", e));
      }
    },
    [isPressed, onPressStart, setIsPressed]
  );

  // Touch
  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isDisabled) return;

      // Prevent emulated mouse events
      ignoreEmulatedMouseEvents.current = true;
      setTimeout(() => {
        ignoreEmulatedMouseEvents.current = false;
      }, 100);

      pressStarted.current = true;
      target.current = e.currentTarget;
      setIsPressed(true);

      onPressStart?.(createPressEvent("pressstart", "touch", e));

      // Add global listeners
      window.addEventListener("touchend", onTouchEndWin, { once: true });
      window.addEventListener("touchcancel", onTouchCancelWin, { once: true });
    },
    [isDisabled, onPressStart, setIsPressed]
  );

  const onTouchEndWin = useCallback(
    (e: TouchEvent) => {
      if (!pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      const evt = {
        ...createPressEvent("pressend", "touch", e),
        target: e.target,
      };

      onPressEnd?.(evt);
      onPressUp?.(evt);

      // Check if touch ended over the target (not reliable across browsers)
      // We'll rely on the touchend event on the element itself for this
    },
    [onPressEnd, onPressUp, setIsPressed]
  );

  const onTouchCancelWin = useCallback(
    (e: TouchEvent) => {
      if (!pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      const evt = {
        ...createPressEvent("pressend", "touch", e),
        target: e.target,
      };

      onPressEnd?.(evt);
    },
    [onPressEnd, setIsPressed]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (isDisabled || !pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      const evt = createPressEvent("pressend", "touch", e);
      onPressEnd?.(evt);
      onPressUp?.(evt);

      // Only trigger press if released over the target
      if (e.currentTarget.contains(e.target as Node)) {
        onPress?.(createPressEvent("press", "touch", e));
      }
    },
    [isDisabled, onPress, onPressEnd, onPressUp, setIsPressed]
  );

  // Keyboard
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isDisabled) return;

      const isValidKey = e.key === "Enter" || e.key === " ";
      if (isValidKey && !isPressed) {
        // Prevent scrolling with spacebar
        if (e.key === " ") {
          e.preventDefault();
        }

        setIsPressed(true);
        pressStarted.current = true;
        onPressStart?.(createPressEvent("pressstart", "keyboard", e));
      }
    },
    [isDisabled, isPressed, onPressStart, setIsPressed]
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (isDisabled) return;

      const isValidKey = e.key === "Enter" || e.key === " ";
      if (isValidKey && isPressed) {
        setIsPressed(false);
        pressStarted.current = false;

        const evt = createPressEvent("pressend", "keyboard", e);
        onPressEnd?.(evt);
        onPressUp?.(createPressEvent("pressup", "keyboard", e));
        onPress?.(createPressEvent("press", "keyboard", e));
      }
    },
    [isDisabled, isPressed, onPress, onPressEnd, onPressUp, setIsPressed]
  );

  // Click for compatibility
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

  // Clean up global listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("mouseup", onMouseUpWin as any);
      window.removeEventListener("touchend", onTouchEndWin as any);
      window.removeEventListener("touchcancel", onTouchCancelWin as any);
    };
  }, [onMouseUpWin, onTouchEndWin, onTouchCancelWin]);

  const pressProps = useMemo(
    () => ({
      tabIndex: isDisabled ? -1 : 0,
      role: "button",
      "aria-disabled": isDisabled || undefined,
      "data-pressed": isPressed ? "true" : undefined,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onMouseEnter,
      onTouchStart,
      onTouchEnd,
      onKeyDown,
      onKeyUp,
      onClick: onClickHandler,
    }),
    [
      isDisabled,
      isPressed,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onMouseEnter,
      onTouchStart,
      onTouchEnd,
      onKeyDown,
      onKeyUp,
      onClickHandler,
    ]
  );

  return { pressProps, isPressed };
}
