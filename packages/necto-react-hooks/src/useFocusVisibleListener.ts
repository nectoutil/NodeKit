/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Portions of this code are based on the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications have been made to adapt the code for use in this project.
 */

'use strict';

import { useEffect } from "react";
import { isMac } from "@necto/platform";
import { isKeyboardFocusEvent } from "@necto-react/helpers";
import { getOwnerWindow, getOwnerDocument } from "@necto/dom";

type Modality = "keyboard" | "pointer" | "virtual";
type HandlerEvent = PointerEvent | MouseEvent | KeyboardEvent | FocusEvent | null;
type Handler = (modality: Modality, e: HandlerEvent) => void;
export type FocusVisibleHandler = (isFocusVisible: boolean) => void;

const hasSetupGlobalListeners = new Map<Window, { focus: () => void }>();
let hasEventBeforeFocus = false;
let hasBlurredWindowRecently = false;
let currentModality: Modality | null = null;
const changeHandlers = new Set<Handler>();

function triggerChangeHandlers(modality: Modality, e: HandlerEvent) {
  changeHandlers.forEach((handler) => handler(modality, e));
}

function isValidKey(e: KeyboardEvent) {
  return !(
    e.metaKey ||
    (!isMac() && e.altKey) ||
    e.ctrlKey ||
    ["Control", "Shift", "Meta"].includes(e.key)
  );
}

function handleKeyboardEvent(e: KeyboardEvent) {
  if (isValidKey(e)) {
    hasEventBeforeFocus = true;
    currentModality = "keyboard";
    triggerChangeHandlers("keyboard", e);
  }
}

function handlePointerEvent(e: PointerEvent | MouseEvent) {
  if (["mousedown", "pointerdown"].includes(e.type)) {
    hasEventBeforeFocus = true;
    currentModality = "pointer";
    triggerChangeHandlers("pointer", e);
  }
}

function handleFocusEvent(e: FocusEvent) {
  if (
    [window, document].includes(e.target as any) ||
    !e.isTrusted ||
    (!hasEventBeforeFocus && !hasBlurredWindowRecently)
  ) {
    return;
  }

  if (!hasEventBeforeFocus && !hasBlurredWindowRecently) {
    currentModality = "virtual";
    triggerChangeHandlers("virtual", e);
  }

  hasEventBeforeFocus = false;
  hasBlurredWindowRecently = false;
}

function handleWindowBlur() {
  hasEventBeforeFocus = false;
  hasBlurredWindowRecently = true;
}

function setupGlobalFocusEvents(element?: HTMLElement | null) {
  const windowObject = getOwnerWindow(element);
  const documentObject = getOwnerDocument(element);

  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    hasSetupGlobalListeners.has(windowObject)
  ) {
    return;
  }

  const originalFocus = windowObject.HTMLElement.prototype.focus;
  windowObject.HTMLElement.prototype.focus = function (...args) {
    hasEventBeforeFocus = true;
    originalFocus.apply(this, args);
  };

  documentObject.addEventListener("keydown", handleKeyboardEvent, true);
  documentObject.addEventListener("click", handlePointerEvent, true);
  windowObject.addEventListener("focus", handleFocusEvent, true);
  windowObject.addEventListener("blur", handleWindowBlur, false);

  if (typeof PointerEvent !== "undefined") {
    documentObject.addEventListener("pointerdown", handlePointerEvent, true);
  }

  hasSetupGlobalListeners.set(windowObject, { focus: originalFocus });
}

function tearDownGlobalFocusEvents(element?: HTMLElement | null) {
  const windowObject = getOwnerWindow(element);
  const documentObject = getOwnerDocument(element);

  if (!hasSetupGlobalListeners.has(windowObject)) return;

  const { focus } = hasSetupGlobalListeners.get(windowObject)!;
  windowObject.HTMLElement.prototype.focus = focus;

  documentObject.removeEventListener("keydown", handleKeyboardEvent, true);
  documentObject.removeEventListener("click", handlePointerEvent, true);
  windowObject.removeEventListener("focus", handleFocusEvent, true);
  windowObject.removeEventListener("blur", handleWindowBlur, false);

  hasSetupGlobalListeners.delete(windowObject);
}

export function addWindowFocusTracking(element?: HTMLElement | null): () => void {
  const documentObject = getOwnerDocument(element);

  if (documentObject.readyState !== "loading") {
    setupGlobalFocusEvents(element);
  } else {
    documentObject.addEventListener("DOMContentLoaded", () =>
      setupGlobalFocusEvents(element)
    );
  }

  return () => tearDownGlobalFocusEvents(element);
}

export function getInteractionModality(): Modality | null {
  return currentModality;
}

export function useFocusVisibleListener(
  fn: FocusVisibleHandler,
  deps: ReadonlyArray<any>,
  opts?: { isTextInput?: boolean }
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  setupGlobalFocusEvents();

  useEffect(() => {
    const handler: Handler = (modality, e) => {
      if (!isKeyboardFocusEvent(!!opts?.isTextInput, modality, e)) return;
      fn(currentModality !== "pointer");
    };

    changeHandlers.add(handler);
    return () => {
      changeHandlers.delete(handler);
      tearDownGlobalFocusEvents();
    };
  }, deps);
}