/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useCallback } from 'react';

import type { FocusManagerProps } from './FocusManager.types';

const TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])'
].join(',');

function getTabbableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR));
}

const GUARD_STYLES: React.CSSProperties = {
  position: 'fixed',
  overflow: 'hidden',
  width: 1,
  height: 1,
  top: 0,
  left: 0,
  padding: 0,
  border: 0,
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap'
};

export function FocusManager(props: FocusManagerProps) {
  const {
    context,
    children,
    disabled = false,
    initialFocus = 0,
    returnFocus = true,
    modal = true,
    closeOnFocusOut = true,
    guards = true
  } = props;

  const previousFocusRef = useRef<Element | null>(null);
  const startGuardRef = useRef<HTMLDivElement | null>(null);
  const endGuardRef = useRef<HTMLDivElement | null>(null);

  // Store the previously focused element and focus the initial element
  useEffect(() => {
    if (disabled || !context.open) return;

    previousFocusRef.current = document.activeElement;

    const floatingEl = context.refs.floating.current;
    if (!floatingEl) return;

    // Defer focus to allow the floating element to render
    const rafId = requestAnimationFrame(() => {
      const tabbable = getTabbableElements(floatingEl);

      if (typeof initialFocus === 'number') {
        const target = tabbable[initialFocus];
        if (target) {
          target.focus();
        } else if (tabbable.length > 0) {
          tabbable[0].focus();
        }
      } else if (initialFocus.current) {
        initialFocus.current.focus();
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [context.open, context.refs.floating, disabled, initialFocus]);

  // Return focus on close
  useEffect(() => {
    if (disabled) return;

    return () => {
      if (
        returnFocus &&
        previousFocusRef.current &&
        previousFocusRef.current instanceof HTMLElement
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [disabled, returnFocus, context.open]);

  // Handle Tab key for focus trapping (modal mode)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled || event.key !== 'Tab') return;

      const floatingEl = context.refs.floating.current;
      if (!floatingEl) return;

      const tabbable = getTabbableElements(floatingEl);
      if (tabbable.length === 0) return;

      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];

      if (modal) {
        // Trap focus within the floating element
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      } else {
        // Non-modal: allow tabbing out but close
        if (
          (event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)
        ) {
          context.onOpenChange(false);
        }
      }
    },
    [context, disabled, modal]
  );

  // Close on focus out
  useEffect(() => {
    if (disabled || !closeOnFocusOut || !context.open) return;

    const floatingEl = context.refs.floating.current;
    if (!floatingEl) return;

    const handleFocusOut = (event: FocusEvent) => {
      const relatedTarget = event.relatedTarget as Node | null;

      if (
        relatedTarget &&
        !floatingEl.contains(relatedTarget) &&
        relatedTarget !== startGuardRef.current &&
        relatedTarget !== endGuardRef.current
      ) {
        context.onOpenChange(false);
      }
    };

    floatingEl.addEventListener('focusout', handleFocusOut);
    return () => floatingEl.removeEventListener('focusout', handleFocusOut);
  }, [context, disabled, closeOnFocusOut]);

  // Guard focus handlers for modal mode
  const handleStartGuardFocus = useCallback(() => {
    const floatingEl = context.refs.floating.current;
    if (!floatingEl) return;

    const tabbable = getTabbableElements(floatingEl);
    if (tabbable.length > 0) {
      tabbable[tabbable.length - 1].focus();
    }
  }, [context.refs.floating]);

  const handleEndGuardFocus = useCallback(() => {
    const floatingEl = context.refs.floating.current;
    if (!floatingEl) return;

    const tabbable = getTabbableElements(floatingEl);
    if (tabbable.length > 0) {
      tabbable[0].focus();
    }
  }, [context.refs.floating]);

  if (disabled) {
    return <>{children}</>;
  }

  const showGuards: boolean = guards && modal;

  return (
    <span onKeyDown={handleKeyDown} style={{ display: 'contents' }}>
      {showGuards && (
        <div
          ref={startGuardRef}
          tabIndex={0}
          aria-hidden
          style={GUARD_STYLES}
          onFocus={handleStartGuardFocus}
        />
      )}
      {children}
      {showGuards && (
        <div
          ref={endGuardRef}
          tabIndex={0}
          aria-hidden
          style={GUARD_STYLES}
          onFocus={handleEndGuardFocus}
        />
      )}
    </span>
  );
}
