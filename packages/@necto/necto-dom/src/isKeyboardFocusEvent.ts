import { getOwnerDocument, getOwnerWindow } from './owner';

export type HandlerEvent =
  | PointerEvent
  | MouseEvent
  | KeyboardEvent
  | FocusEvent
  | null;
export type Modality = 'keyboard' | 'pointer' | 'virtual';

const nonTextInputTypes = new Set([
  'checkbox',
  'radio',
  'range',
  'color',
  'file',
  'image',
  'button',
  'submit',
  'reset'
]);

// Only Tab and Escape are considered focus-visible keys for text inputs
const FOCUS_VISIBLE_INPUT_KEYS: Record<string, true> = {
  Tab: true,
  Escape: true
};

export function isKeyboardFocusEvent(
  isTextInput: boolean,
  modality: Modality,
  event: HandlerEvent
): boolean {
  if (!event || !('target' in event) || !event.target) return false;

  const ownerDocument: Document = getOwnerDocument(event.target as Element);
  const ownerWin = getOwnerWindow(event.target as Element);

  if (!ownerDocument || !ownerWin) return false;

  // Use window-specific constructors for cross-frame support
  const IHTMLInputElement =
    typeof window !== 'undefined'
      ? ownerWin.HTMLInputElement
      : HTMLInputElement;
  const IHTMLTextAreaElement =
    typeof window !== 'undefined'
      ? ownerWin.HTMLTextAreaElement
      : HTMLTextAreaElement;
  const IHTMLElement =
    typeof window !== 'undefined' ? ownerWin.HTMLElement : HTMLElement;
  const IKeyboardEvent =
    typeof window !== 'undefined' ? ownerWin.KeyboardEvent : KeyboardEvent;

  const activeElement: Element | null = ownerDocument.activeElement;

  isTextInput =
    isTextInput ||
    (activeElement instanceof IHTMLInputElement &&
      !nonTextInputTypes.has((activeElement as HTMLInputElement).type)) ||
    activeElement instanceof IHTMLTextAreaElement ||
    (activeElement instanceof IHTMLElement &&
      (activeElement as HTMLElement).isContentEditable);

  if (
    isTextInput &&
    modality === 'keyboard' &&
    event instanceof IKeyboardEvent &&
    !FOCUS_VISIBLE_INPUT_KEYS[(event as KeyboardEvent).key]
  ) {
    return false;
  }

  return true;
}
