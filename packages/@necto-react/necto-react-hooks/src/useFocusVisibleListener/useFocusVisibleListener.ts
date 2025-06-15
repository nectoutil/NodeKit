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
import { useSupported } from '@necto-react/hooks';
import { isKeyboardFocusEvent } from '@necto-react/helpers';
import { getOwnerDocument, getOwnerWindow } from '@necto/dom';
import { globalListeners, changeHandlers, focusState } from './focusContext';

import type { UseFocusVisibleListenerProps, Modality, HandlerEvent } from './useFocusVisibleListener.types';

/**
 * React hook that listens for focus visibility changes based on interaction modality.
 *
 * @param {UseFocusVisibleListenerProps} props - The props for the focus visible listener.
 * @returns {void}
 */
export function useFocusVisibleListener(p0: (isFocusVisible: boolean | ((prevState: boolean) => boolean)) => void, p1: (boolean | undefined)[], p2: { isTextInput: boolean | undefined; }, props: UseFocusVisibleListenerProps): void {
  const { fn, deps, opts } = props;

  const isBrowserEnvironment = useSupported(() =>
    typeof window !== 'undefined' && typeof document !== 'undefined'
  );

  if (!isBrowserEnvironment) {
    return;
  }

  const triggerChangeHandlers = (modality: Modality, e: HandlerEvent) => {
    changeHandlers.forEach((handler) => handler(modality, e));
  };

  const isValidKey = (e: KeyboardEvent) => {
    return !(
      e.metaKey ||
      (!isMacOS && e.altKey) ||
      e.ctrlKey ||
      ['Control', 'Shift', 'Meta'].includes(e.key)
    );
  };

  // --- Keyboard Event Handler ---
  const handleKeyboardEvent = (e: KeyboardEvent) => {
    if (isValidKey(e)) {
      focusState.hasEventBeforeFocus = true;
      focusState.currentModality = 'keyboard';
      triggerChangeHandlers('keyboard', e);
    }
  };

  // --- Pointer Event Handler ---
  const handlePointerEvent = (e: PointerEvent | MouseEvent) => {
    if (['mousedown', 'pointerdown'].includes(e.type)) {
      focusState.hasEventBeforeFocus = true;
      focusState.currentModality = 'pointer';
      triggerChangeHandlers('pointer', e);
    }
  };

  // --- Focus Event Handler ---
  const handleFocusEvent = (e: FocusEvent) => {
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
  };

  const handleWindowBlur = () => {
    focusState.hasEventBeforeFocus = false;
    focusState.hasBlurredWindowRecently = true;
  };

  useEffect(() => {
    const windowObject = getOwnerWindow(null);
    const documentObject = getOwnerDocument(null);

    if (!globalListeners.has(windowObject)) {
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

    const handler = (modality: Modality, e: HandlerEvent) => {
      if (!isKeyboardFocusEvent(!!opts?.isTextInput, modality, e)) return;
      fn(focusState.currentModality !== 'pointer');
    };

    changeHandlers.add(handler);

    return () => {
      changeHandlers.delete(handler);

      if (changeHandlers.size === 0 && globalListeners.has(windowObject)) {
        const { focus } = globalListeners.get(windowObject)!;
        windowObject.HTMLElement.prototype.focus = focus;

        documentObject.removeEventListener('keydown', handleKeyboardEvent, true);
        documentObject.removeEventListener('click', handlePointerEvent, true);
        windowObject.removeEventListener('focus', handleFocusEvent, true);
        documentObject.removeEventListener('blur', handleWindowBlur, false);

        globalListeners.delete(windowObject);
      }
    };
  }, deps);
}