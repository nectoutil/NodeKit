/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getOwnerDocument, nodeContains } from '@necto/dom';
import { useRef, useCallback, useEffect, useMemo } from 'react';

import type { RefObject } from 'react';
import type { UseDismissOptions, UseDismissReturn } from './useDismiss.types';

/**
 * Provides dismiss interaction (outside click, escape key) for floating elements.
 * @param options - Configuration options.
 * @returns Props to spread on reference and floating elements.
 */
export function useDismiss(options: UseDismissOptions): UseDismissReturn {
  const {
    open,
    enabled = true,
    bubbles = false,
    escapeKey = true,
    outsidePress = true,
    referencePress = false,
    ancestorScroll = false,

    // Callbacks
    onOpenChange
  } = options;

  const insideTreeRef: RefObject<boolean> = useRef(false);
  const referenceRef: RefObject<Element | null> = useRef<Element | null>(null);
  const floatingRef: RefObject<HTMLElement | null> = useRef<HTMLElement | null>(
    null
  );

  const escapeKeyBubbles: boolean =
    typeof bubbles === 'boolean' ? bubbles : (bubbles.escapeKey ?? false);
  const outsidePressBubbles: boolean =
    typeof bubbles === 'boolean' ? bubbles : (bubbles.outsidePress ?? false);

  const closeOnEscapeKey: (event: KeyboardEvent) => void = useCallback(
    (event: KeyboardEvent): void => {
      if (!open || !escapeKey) {
        return;
      }

      if (event.key === 'Escape') {
        if (!escapeKeyBubbles) {
          event.stopPropagation();
        }

        onOpenChange(false);
      }
    },
    [open, escapeKey, escapeKeyBubbles, onOpenChange]
  );

  const closeOnOutsidePress: (event: MouseEvent) => void = useCallback(
    (event: MouseEvent): void => {
      if (!open) {
        return;
      }

      if (insideTreeRef.current) {
        insideTreeRef.current = false;
        return;
      }

      const target = event.target as Element;

      if (referenceRef.current && nodeContains(referenceRef.current, target)) {
        if (!referencePress) {
          return;
        }
      }

      if (floatingRef.current && nodeContains(floatingRef.current, target)) {
        return;
      }

      if (typeof outsidePress === 'function' && !outsidePress(event)) {
        return;
      }

      if (!outsidePressBubbles) {
        event.stopPropagation();
      }

      onOpenChange(false);
    },
    [open, outsidePress, outsidePressBubbles, referencePress, onOpenChange]
  );

  useEffect(() => {
    if (!enabled || !open) return;

    const ownerDocument: Document = getOwnerDocument(floatingRef.current);
    if (!ownerDocument) {
      return;
    }

    if (escapeKey) {
      ownerDocument.addEventListener('keydown', closeOnEscapeKey);
    }

    if (outsidePress) {
      ownerDocument.addEventListener('mousedown', closeOnOutsidePress);
    }

    return (): void => {
      ownerDocument.removeEventListener('keydown', closeOnEscapeKey);
      ownerDocument.removeEventListener('mousedown', closeOnOutsidePress);
    };
  }, [
    open,
    enabled,
    escapeKey,
    outsidePress,
    closeOnEscapeKey,
    closeOnOutsidePress
  ]);

  useEffect(() => {
    if (!enabled || !open || !ancestorScroll) {
      return;
    }

    const scrollHandler = () => {
      onOpenChange(false);
    };

    const reference: Element | null = referenceRef.current;
    if (!reference) {
      return;
    }

    const cleanup: (() => void)[] = [];
    let current: Element | null = reference.parentElement;

    while (current) {
      current.addEventListener('scroll', scrollHandler);
      cleanup.push(() =>
        (current as Element).removeEventListener('scroll', scrollHandler)
      );
      current = current.parentElement;
    }

    window.addEventListener('scroll', scrollHandler);
    cleanup.push(() => window.removeEventListener('scroll', scrollHandler));

    return (): void => {
      cleanup.forEach((fn) => fn());
    };
  }, [enabled, open, ancestorScroll, onOpenChange]);

  const reference = useMemo(() => {
    if (!enabled) {
      return {};
    }

    return {
      ref: (node: Element | null): void => {
        referenceRef.current = node;
      }
    };
  }, [enabled]);

  const floating = useMemo(() => {
    if (!enabled) {
      return {};
    }

    return {
      ref: (node: HTMLElement | null) => {
        floatingRef.current = node;
      },
      onPointerDown: () => {
        insideTreeRef.current = true;
      }
    };
  }, [enabled]);

  return {
    reference,
    floating
  };
}
