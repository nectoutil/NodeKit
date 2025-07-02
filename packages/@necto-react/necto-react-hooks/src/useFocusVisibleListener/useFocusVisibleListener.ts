// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay here.
// biome-ignore-all lint/style/noNonNullAssertion: Null assertions okay here.

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

import { isMacOS } from 'std-env';
import { useEffect } from 'react';
import { isKeyboardFocusEvent } from '@necto-react/helpers';
import { getOwnerDocument, getOwnerWindow } from '@necto/dom';
import { globalListeners, changeHandlers, focusState } from './focusContext';

import type {
  UseFocusVisibleListenerProps,
  Modality,
  HandlerEvent,
  Handler
} from './useFocusVisibleListener.types';

function triggerChangeHandlers(modality: Modality, e: HandlerEvent) {
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

  if (!globalListeners.has(windowObject)) return;

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
 * @param {UseFocusVisibleListenerProps} props - The props for the focus visible listener.
 * @returns {void}
 */
export function useFocusVisibleListener(
  props: UseFocusVisibleListenerProps
): void {
  const { fn, deps, opts } = props;

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
