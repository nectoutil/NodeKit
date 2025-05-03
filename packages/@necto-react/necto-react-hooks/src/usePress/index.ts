/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { getOwnerWindow } from "@necto/dom";
import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { disableTextSelection, restoreTextSelection } from "./textSelection";

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

  allowTextSelectionOnPress?: boolean;

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
    allowTextSelectionOnPress,
    ref: domRef,
  } = props;

  const [isPressed, setPressed] = useState(false);
  const ignoreEmulatedMouseEvents = useRef(false);
  const target = useRef<EventTarget | null>(null);
  const pressStarted = useRef(false);

  const setIsPressed = useCallback(
    (pressed: boolean) => {
      if (isPressed !== pressed) {
        setPressed(pressed);
        onPressChange?.(pressed);
      }
    },
    [isPressed, onPressChange]
  );

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

      const evt = createPressEvent("pressstart", "mouse", e);
      onPressStart?.(evt);

      window.addEventListener("mouseup", onMouseUpWin as any, { once: true });
    },
    [isDisabled, onPressStart, preventFocusOnPress, setIsPressed, allowTextSelectionOnPress]
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

      // Restore text selection
      if (!allowTextSelectionOnPress && target.current instanceof HTMLElement) {
        restoreTextSelection(target.current);
      }

      const evt = {
        ...createPressEvent("pressend", "mouse", e),
        target: e.target,
      };

      onPressEnd?.(evt);
      onPressUp?.(evt);

      if (isPressedOver) {
        onPress?.(evt);
      }
    },
    [onPressEnd, onPressUp, onPress, setIsPressed, allowTextSelectionOnPress]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDisabled || e.button !== 0 || !pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      // Restore text selection
      if (!allowTextSelectionOnPress && e.currentTarget instanceof HTMLElement) {
        restoreTextSelection(e.currentTarget);
      }

      const evt = createPressEvent("pressend", "mouse", e);
      onPressEnd?.(evt);
      onPressUp?.(evt);

      if (e.currentTarget instanceof Node && e.currentTarget.contains(e.target as Node)) {
        onPress?.(createPressEvent("press", "mouse", e));
      }
    },
    [isDisabled, onPress, onPressEnd, onPressUp, setIsPressed, allowTextSelectionOnPress]
  );

  const onMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (isPressed) {
        setIsPressed(false);
        onPressEnd?.(createPressEvent("pressend", "mouse", e));
        // Restore text selection if needed
        if (!allowTextSelectionOnPress && e.currentTarget instanceof HTMLElement) {
          restoreTextSelection(e.currentTarget);
        }
      }
    },
    [isPressed, setIsPressed, onPressEnd, allowTextSelectionOnPress]
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

      onPressStart?.(createPressEvent("pressstart", "touch", e));

      window.addEventListener("touchend", onTouchEndWin as any, { once: true });
      window.addEventListener("touchcancel", onTouchCancelWin as any, { once: true });
    },
    [isDisabled, onPressStart, setIsPressed, allowTextSelectionOnPress]
  );

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
        ...createPressEvent("pressend", "touch", e),
        target: e.target,
      };

      onPressEnd?.(evt as any);
      onPressUp?.(evt as any);
    },
    [onPressEnd, onPressUp, setIsPressed, allowTextSelectionOnPress]
  );

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
        ...createPressEvent("pressend", "touch", e),
        target: e.target,
      };

      onPressEnd?.(evt as any);
    },
    [onPressEnd, setIsPressed, allowTextSelectionOnPress]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (isDisabled || !pressStarted.current) return;

      pressStarted.current = false;
      setIsPressed(false);

      // Restore text selection
      if (!allowTextSelectionOnPress && e.currentTarget instanceof HTMLElement) {
        restoreTextSelection(e.currentTarget);
      }

      const evt = createPressEvent("pressend", "touch", e);
      onPressEnd?.(evt);
      onPressUp?.(evt);

      if (e.currentTarget instanceof Node && e.currentTarget.contains(e.target as Node)) {
        onPress?.(createPressEvent("press", "touch", e));
      }
    },
    [isDisabled, onPress, onPressEnd, onPressUp, setIsPressed, allowTextSelectionOnPress]
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

        // Disable text selection if not allowed
        if (!allowTextSelectionOnPress) {
          disableTextSelection();
        }

        setIsPressed(true);
        pressStarted.current = true;
        onPressStart?.(createPressEvent("pressstart", "keyboard", e));
      }
    },
    [isDisabled, isPressed, onPressStart, setIsPressed, allowTextSelectionOnPress]
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (isDisabled) return;

      const isValidKey = e.key === "Enter" || e.key === " ";
      if (isValidKey && isPressed) {
        setIsPressed(false);
        pressStarted.current = false;

        // Restore text selection if not allowed
        if (!allowTextSelectionOnPress) {
          restoreTextSelection();
        }

        const evt = createPressEvent("pressend", "keyboard", e);
        onPressEnd?.(evt);
        onPressUp?.(createPressEvent("pressup", "keyboard", e));
        onPress?.(createPressEvent("press", "keyboard", e));
      }
    },
    [isDisabled, isPressed, onPress, onPressEnd, onPressUp, setIsPressed, allowTextSelectionOnPress]
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

  useEffect(() => {
    return () => {
      window.removeEventListener("mouseup", onMouseUpWin as any);
      window.removeEventListener("touchend", onTouchEndWin as any);
      window.removeEventListener("touchcancel", onTouchCancelWin as any);
    };
  }, [onMouseUpWin, onTouchEndWin, onTouchCancelWin]);

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
      onClick: onClickHandler,
    }),
    [
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

  useEffect(() => {
    let element = domRef?.current;
    if (element && (element instanceof getOwnerWindow(element).Element)) {
      let style = getOwnerWindow(element).getComputedStyle(element);
      if (style.touchAction === 'auto') {
        (element as HTMLElement).style.touchAction = 'pan-x pan-y pinch-zoom';
      }
    }
  }, [domRef]);

  return { pressProps, isPressed };
}