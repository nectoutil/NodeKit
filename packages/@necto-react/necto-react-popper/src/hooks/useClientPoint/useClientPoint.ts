/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';

import type { UseClientPointOptions, UseClientPointReturn } from './types';

/**
 * Provides cursor-position-based positioning for floating elements.
 * @param options - Configuration options.
 * @returns Props to spread on reference and floating elements.
 */
export function useClientPoint(
  options: UseClientPointOptions
): UseClientPointReturn {
  const { open, enabled = true, axis = 'both', setReference } = options;

  const clientPointRef = useRef({ x: 0, y: 0 });
  const initialReferenceRect = useRef<DOMRect | null>(null);

  const createVirtualElement = useCallback(
    (x: number, y: number) => {
      return {
        getBoundingClientRect: () => {
          const base = initialReferenceRect.current ?? {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          };

          const newX = axis === 'y' ? base.x : x;
          const newY = axis === 'x' ? base.y : y;

          return {
            x: newX,
            y: newY,
            width: 0,
            height: 0,
            top: newY,
            right: newX,
            bottom: newY,
            left: newX,
            toJSON: () => ({})
          } as DOMRect;
        }
      };
    },
    [axis]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!enabled) return;

      clientPointRef.current = { x: e.clientX, y: e.clientY };

      if (setReference) {
        setReference(createVirtualElement(e.clientX, e.clientY));
      }
    },
    [enabled, setReference, createVirtualElement]
  );

  useEffect(() => {
    if (!enabled || !open) return;

    document.addEventListener('pointermove', handlePointerMove);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, [enabled, open, handlePointerMove]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;

      const target = e.currentTarget as Element;
      initialReferenceRect.current = target.getBoundingClientRect();
      clientPointRef.current = { x: e.clientX, y: e.clientY };

      if (setReference) {
        setReference(createVirtualElement(e.clientX, e.clientY));
      }
    },
    [enabled, setReference, createVirtualElement]
  );

  const reference = useMemo(() => {
    if (!enabled) return {};

    return {
      onPointerDown: handlePointerDown
    };
  }, [enabled, handlePointerDown]);

  return {
    reference,
    floating: {}
  };
}
