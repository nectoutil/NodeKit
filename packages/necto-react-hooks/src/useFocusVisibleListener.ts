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
import { getOwnerWindow, getOwnerDocument } from "@necto/dom";
import { isKeyboardFocusEvent, isVirtualClick } from "@necto-react/helpers";

export type FocusVisibleHandler = (isFocusVisible: boolean) => void;
interface GlobalListenerData {
  focus: () => void;
  teardown: () => void;
}

// this should be modified by other functions
export let ignoreFocusEvent = false;


let hasBlurredWindowRecently = false;
type HandlerEvent = PointerEvent | MouseEvent | KeyboardEvent | FocusEvent | null;
type Handler = (modality: Modality, e: HandlerEvent) => void;
type Modality = 'keyboard' | 'pointer' | 'virtual';
let changeHandlers = new Set<Handler>();
let currentModality: null | Modality = null;
let hasEventBeforeFocus = false;
function isValidKey(e: KeyboardEvent) {
  // Control and Shift keys trigger when navigating back to the tab with keyboard.
  return !(e.metaKey || (!isMac() && e.altKey) || e.ctrlKey || e.key === 'Control' || e.key === 'Shift' || e.key === 'Meta');
}

export let hasSetupGlobalListeners = new Map<Window, GlobalListenerData>();

function handleKeyboardEvent(e: KeyboardEvent) {
  hasEventBeforeFocus = true;
  if (isValidKey(e)) {
    currentModality = 'keyboard';
    for (let handler of changeHandlers) {
      handler('keyboard', e);
    }
  }
}

function handlePointerEvent(e: Event) {
  const pointerEvent = e as PointerEvent | MouseEvent;
  currentModality = 'pointer';
  if (e.type === 'mousedown' || e.type === 'pointerdown') {
    for (let handler of changeHandlers) {
      handler('pointer', pointerEvent);
    }
  }
}

function handleClickEvent(e: MouseEvent) {
  if (isVirtualClick(e)) {
    hasEventBeforeFocus = true;
    currentModality = 'virtual';
  }
}

function handleFocusEvent(e: FocusEvent) {
  // Firefox fires two extra focus events when the user first clicks into an iframe:
  // first on the window, then on the document. We ignore these events so they don't
  // cause keyboard focus rings to appear.
  if (e.target === window || e.target === document || ignoreFocusEvent || !e.isTrusted) {
    return;
  }

  // If a focus event occurs without a preceding keyboard or pointer event, switch to virtual modality.
  // This occurs, for example, when navigating a form with the next/previous buttons on iOS.
  if (!hasEventBeforeFocus && !hasBlurredWindowRecently) {
    currentModality = 'virtual';
    for (let handler of changeHandlers) {
      handler('virtual', e);
    }
  }

  hasEventBeforeFocus = false;
  hasBlurredWindowRecently = false;
}

function handleWindowBlur() {
  if (ignoreFocusEvent) {
    return;
  }

  // When the window is blurred, reset state. This is necessary when tabbing out of the window,
  // for example, since a subsequent focus event won't be fired.
  hasEventBeforeFocus = false;
  hasBlurredWindowRecently = true;
}

function setupGlobalFocusEvents(element?: HTMLElement | null) {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return;
  }

  const windowObject = getOwnerWindow(element);
  const documentObject = getOwnerDocument(element);

  if (hasSetupGlobalListeners.get(windowObject)) {
    return;
  }

  // Store original focus method
  const originalFocus = windowObject.HTMLElement.prototype.focus;

  function customFocus(this: HTMLElement, options?: FocusOptions) {
    hasEventBeforeFocus = true;
    return originalFocus.call(this, options);
  }

  // Override focus method if not already overridden
  if (windowObject.HTMLElement.prototype.focus !== customFocus) {
    windowObject.HTMLElement.prototype.focus = customFocus;
  }

  // Event listener configs
  const docEvents: [string, EventListenerOrEventListenerObject, boolean][] = [
    ['keydown', handleKeyboardEvent as EventListener, true],
    ['keyup', handleKeyboardEvent as EventListener, true],
    ['click', handleClickEvent as EventListener, true],
  ];

  const winEvents: [string, EventListenerOrEventListenerObject, boolean][] = [
    ['focus', handleFocusEvent as EventListener, true],
    ['blur', handleWindowBlur, false],
  ];

  // Pointer or mouse events
  let pointerEvents: [string, EventListenerOrEventListenerObject, boolean][] = [];
  if (typeof PointerEvent !== 'undefined') {
    pointerEvents = [
      ['pointerdown', handlePointerEvent, true],
      ['pointermove', handlePointerEvent, true],
      ['pointerup', handlePointerEvent, true],
    ];
  } else if (process.env.NODE_ENV === 'test') {
    pointerEvents = [
      ['mousedown', handlePointerEvent, true],
      ['mousemove', handlePointerEvent, true],
      ['mouseup', handlePointerEvent, true],
    ];
  }

  // Add all document event listeners
  [...docEvents, ...pointerEvents].forEach(([type, handler, capture]) => {
    documentObject.addEventListener(type, handler, capture);
  });

  // Add all window event listeners
  winEvents.forEach(([type, handler, capture]) => {
    windowObject.addEventListener(type, handler, capture);
  });

  function teardown() {
    // Restore original focus method
    windowObject.HTMLElement.prototype.focus = originalFocus;

    [...docEvents, ...pointerEvents].forEach(([type, handler, capture]) => {
      documentObject.removeEventListener(type, handler, capture);
    });

    winEvents.forEach(([type, handler, capture]) => {
      windowObject.removeEventListener(type, handler, capture);
    });

    windowObject.removeEventListener('beforeunload', teardown);

    hasSetupGlobalListeners.delete(windowObject);
  }

  windowObject.addEventListener('beforeunload', teardown, { once: true });

  hasSetupGlobalListeners.set(windowObject, { focus: originalFocus, teardown });
}


export function useFocusVisibleListener(fn: FocusVisibleHandler, deps: ReadonlyArray<any>, opts?: {isTextInput?: boolean}): void {
  setupGlobalFocusEvents();

  useEffect(() => {
    let handler = (modality: Modality, e: HandlerEvent) => {
      // We want to early return for any keyboard events that occur inside text inputs EXCEPT for Tab and Escape
      if (!isKeyboardFocusEvent(!!(opts?.isTextInput), modality, e)) {
        return;
      }
      fn(currentModality !== 'pointer');
    };
    changeHandlers.add(handler);
    return () => {
      changeHandlers.delete(handler);
    };

  }, deps);
}