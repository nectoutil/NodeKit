/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useCallback, useEffect, useMemo } from 'react';
import { getOwnerDocument, nodeContains } from '@necto/dom';

import type { UseDismissProps, UseDismissReturn } from './types';

/**
 * Provides dismiss interaction (outside click, escape key) for floating elements.
 * @param props - Configuration options.
 * @returns Props to spread on reference and floating elements.
 */
export function useDismiss(props: UseDismissProps): UseDismissReturn {
  const {
    open,
    onOpenChange,
    enabled = true,
    escapeKey = true,
    outsidePress = true,
    referencePress = false,
    ancestorScroll = false,
    bubbles = false
  } = props;

  const referenceRef = useRef<Element | null>(null);
  const floatingRef = useRef<HTMLElement | null>(null);
  const insideTreeRef = useRef(false);

  const escapeKeyBubbles =
    typeof bubbles === 'boolean' ? bubbles : (bubbles.escapeKey ?? false);
  const outsidePressBubbles =
    typeof bubbles === 'boolean' ? bubbles : (bubbles.outsidePress ?? false);

  const closeOnEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (!open || !escapeKey) return;

      if (event.key === 'Escape') {
        if (!escapeKeyBubbles) {
          event.stopPropagation();
        }
        onOpenChange(false);
      }
    },
    [open, escapeKey, escapeKeyBubbles, onOpenChange]
  );

  const closeOnOutsidePress = useCallback(
    (event: MouseEvent) => {
      if (!open) return;
      if (insideTreeRef.current) {
        insideTreeRef.current = false;
        return;
      }

      const target = event.target as Element;

      if (referenceRef.current && nodeContains(referenceRef.current, target)) {
        if (!referencePress) return;
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

    const doc = getOwnerDocument(floatingRef.current);

    if (escapeKey) {
      doc.addEventListener('keydown', closeOnEscapeKey);
    }

    if (outsidePress) {
      doc.addEventListener('mousedown', closeOnOutsidePress);
    }

    return () => {
      doc.removeEventListener('keydown', closeOnEscapeKey);
      doc.removeEventListener('mousedown', closeOnOutsidePress);
    };
  }, [
    enabled,
    open,
    escapeKey,
    outsidePress,
    closeOnEscapeKey,
    closeOnOutsidePress
  ]);

  useEffect(() => {
    if (!enabled || !open || !ancestorScroll) return;

    const scrollHandler = () => {
      onOpenChange(false);
    };

    const reference = referenceRef.current;
    if (!reference) return;

    let current: Element | null = reference.parentElement;
    const cleanup: (() => void)[] = [];

    while (current) {
      current.addEventListener('scroll', scrollHandler);
      const el = current;
      cleanup.push(() => el.removeEventListener('scroll', scrollHandler));
      current = current.parentElement;
    }

    window.addEventListener('scroll', scrollHandler);
    cleanup.push(() => window.removeEventListener('scroll', scrollHandler));

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [enabled, open, ancestorScroll, onOpenChange]);

  const reference = useMemo(() => {
    if (!enabled) return {};

    return {
      ref: (node: Element | null) => {
        referenceRef.current = node;
      }
    };
  }, [enabled]);

  const floating = useMemo(() => {
    if (!enabled) return {};

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
