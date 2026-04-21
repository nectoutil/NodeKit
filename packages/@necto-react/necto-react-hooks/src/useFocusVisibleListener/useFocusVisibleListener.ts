/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay here.
// biome-ignore-all lint/style/noNonNullAssertion: Null assertions okay here.
// biome-ignore-all lint/correctness/useExhaustiveDependencies: Intentional dependency management.
// biome-ignore-all lint/correctness/useHookAtTopLevel: Conditional hook usage is intentional.

import { isMacOS } from 'std-env';
import { useEffect } from 'react';
import {
  getOwnerDocument,
  getOwnerWindow,
  isKeyboardFocusEvent
} from '@necto/dom';
import { globalListeners, changeHandlers, focusState } from './focusContext';

import type {
  UseFocusVisibleListenerOptions,
  Modality,
  HandlerEvent,
  Handler
} from './useFocusVisibleListener.types';

function triggerChangeHandlers(modality: Modality, e: HandlerEvent) {
  // biome-ignore lint/suspicious/useIterableCallbackReturn: Implicit return is intentional and harmless here.
  changeHandlers.forEach((handler: Handler) => handler(modality, e));
}

function isValidKey(e: KeyboardEvent): boolean {
  return !(
    e.metaKey ||
    (isMacOS && e.altKey) ||
    e.ctrlKey ||
    ['Control', 'Shift', 'Meta'].includes(e.key)
  );
}

function handleKeyboardEvent(e: KeyboardEvent) {
  if (isValidKey(e)) {
    focusState.hasEventBeforeFocus = true;
    focusState.currentModality = 'keyboard';
    triggerChangeHandlers('keyboard', e);
  }
}

function handlePointerEvent(e: PointerEvent | MouseEvent) {
  if (['mousedown', 'pointerdown'].includes(e.type)) {
    focusState.hasEventBeforeFocus = true;
    focusState.currentModality = 'pointer';
    triggerChangeHandlers('pointer', e);
  }
}

function handleFocusEvent(e: FocusEvent) {
  if (
    [window, document].includes(e.target as any) ||
    !e.isTrusted ||
    (!focusState.hasEventBeforeFocus && !focusState.hasBlurredWindowRecently)
  ) {
    return;
  }

  if (!focusState.hasEventBeforeFocus && !focusState.hasBlurredWindowRecently) {
    focusState.currentModality = 'virtual';
    triggerChangeHandlers('virtual', e);
  }

  focusState.hasEventBeforeFocus = false;
  focusState.hasBlurredWindowRecently = false;
}

function handleWindowBlur() {
  focusState.hasEventBeforeFocus = false;
  focusState.hasBlurredWindowRecently = true;
}

function setupGlobalFocusEvents(element?: HTMLElement | null) {
  const windowObject = getOwnerWindow(element);
  const documentObject = getOwnerDocument(element);

  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !windowObject ||
    !documentObject ||
    globalListeners.has(windowObject)
  ) {
    return;
  }

  const originalFocus = windowObject.HTMLElement.prototype.focus;
  windowObject.HTMLElement.prototype.focus = function (...args) {
    focusState.hasEventBeforeFocus = true;
    originalFocus.apply(this, args);
  };

  documentObject.addEventListener('keydown', handleKeyboardEvent, true);
  documentObject.addEventListener('click', handlePointerEvent, true);
  windowObject.addEventListener('focus', handleFocusEvent, true);
  windowObject.addEventListener('blur', handleWindowBlur, false);

  if (typeof PointerEvent !== 'undefined') {
    documentObject.addEventListener('pointerdown', handlePointerEvent, true);
  }

  globalListeners.set(windowObject, { focus: originalFocus });
}

function tearDownGlobalFocusEvents(element?: HTMLElement | null) {
  const windowObject = getOwnerWindow(element);
  const documentObject = getOwnerDocument(element);

  if (!windowObject || !documentObject || !globalListeners.has(windowObject))
    return;

  const { focus } = globalListeners.get(windowObject)!;
  windowObject.HTMLElement.prototype.focus = focus;

  documentObject.removeEventListener('keydown', handleKeyboardEvent, true);
  documentObject.removeEventListener('click', handlePointerEvent, true);
  windowObject.removeEventListener('focus', handleFocusEvent, true);
  windowObject.removeEventListener('blur', handleWindowBlur, false);

  globalListeners.delete(windowObject);
}

export function addWindowFocusTracking(
  element?: HTMLElement | null
): () => void {
  const documentObject = getOwnerDocument(element);

  if (!documentObject) {
    return () => {};
  }

  if (documentObject.readyState !== 'loading') {
    setupGlobalFocusEvents(element);
  } else {
    documentObject.addEventListener('DOMContentLoaded', () =>
      setupGlobalFocusEvents(element)
    );
  }

  return () => tearDownGlobalFocusEvents(element);
}

export function getInteractionModality(): Modality | null {
  return focusState.currentModality;
}

/**
 * React hook that listens for focus visibility changes based on interaction modality.
 *
 * @param {UseFocusVisibleListenerOptions} options - The options for the focus visible listener.
 * @returns {void}
 */
export function useFocusVisibleListener(
  options: UseFocusVisibleListenerOptions
): void {
  const { fn, deps, opts } = options;

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  setupGlobalFocusEvents();

  useEffect(() => {
    const handler: Handler = (modality, e) => {
      if (!isKeyboardFocusEvent(!!opts?.isTextInput, modality, e)) return;
      fn(focusState.currentModality !== 'pointer');
    };

    changeHandlers.add(handler);
    return () => {
      changeHandlers.delete(handler);
      tearDownGlobalFocusEvents();
    };
  }, deps);
}
