'use strict';

import { getOwnerDocument, getOwnerWindow } from "@necto/dom";

export type Modality = 'keyboard' | 'pointer' | 'virtual';
export type HandlerEvent = PointerEvent | MouseEvent | KeyboardEvent | FocusEvent | null;

const nonTextInputTypes = new Set([
  'checkbox', 'radio', 'range', 'color', 'file', 'image', 'button', 'submit', 'reset'
]);

// Only Tab and Escape are considered focus-visible keys for text inputs
const FOCUS_VISIBLE_INPUT_KEYS: Record<string, true> = {
  Tab: true,
  Escape: true
};

export function isKeyboardFocusEvent(
  isTextInput: boolean,
  modality: Modality,
  e: HandlerEvent
): boolean {
  if (!e || !('target' in e) || !e.target) return false;

  const ownerDoc = getOwnerDocument(e.target as Element);
  const ownerWin = getOwnerWindow(e.target as Element);

  // Use window-specific constructors for cross-frame support
  const IHTMLInputElement = typeof window !== 'undefined' ? ownerWin.HTMLInputElement : HTMLInputElement;
  const IHTMLTextAreaElement = typeof window !== 'undefined' ? ownerWin.HTMLTextAreaElement : HTMLTextAreaElement;
  const IHTMLElement = typeof window !== 'undefined' ? ownerWin.HTMLElement : HTMLElement;
  const IKeyboardEvent = typeof window !== 'undefined' ? ownerWin.KeyboardEvent : KeyboardEvent;

  const activeEl = ownerDoc.activeElement;

  isTextInput = isTextInput ||
    (activeEl instanceof IHTMLInputElement && !nonTextInputTypes.has((activeEl as HTMLInputElement).type)) ||
    activeEl instanceof IHTMLTextAreaElement ||
    (activeEl instanceof IHTMLElement && (activeEl as HTMLElement).isContentEditable);

  if (
    isTextInput &&
    modality === 'keyboard' &&
    e instanceof IKeyboardEvent &&
    !FOCUS_VISIBLE_INPUT_KEYS[(e as KeyboardEvent).key]
  ) {
    return false;
  }

  return true;
}
