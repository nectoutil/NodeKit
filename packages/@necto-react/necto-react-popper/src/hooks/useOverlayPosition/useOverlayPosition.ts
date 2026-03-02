/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useEffect, useCallback } from 'react';
import {
  offset as offsetMiddleware,
  flip as flipMiddleware,
  shift as shiftMiddleware,
  size as sizeMiddleware,
  arrow as arrowMiddleware,
  autoUpdate,
  getSide
} from '@necto/popper';
import { usePopper } from '../usePopper';

import type { CSSProperties } from 'react';
import type { Middleware, Side } from '@necto/popper';
import type {
  UseOverlayPositionOptions,
  UseOverlayPositionReturn
} from './useOverlayPosition.types';

export function useOverlayPosition(
  options: UseOverlayPositionOptions
): UseOverlayPositionReturn {
  const {
    targetRef,
    overlayRef,
    arrowRef,
    placement: requestedPlacement = 'bottom',
    offset = 0,
    crossOffset = 0,
    shouldFlip = true,
    containerPadding = 12,
    arrowBoundaryOffset = 0,
    isOpen = false,
    maxHeight,
    onClose,
    shouldUpdatePosition = true
  } = options;

  const middleware = useMemo(() => {
    const mw: Middleware[] = [];

    if (offset > 0) {
      mw.push(offsetMiddleware(offset));
    }

    if (shouldFlip) {
      mw.push(flipMiddleware({ padding: containerPadding }));
    }

    mw.push(shiftMiddleware({ padding: containerPadding }));

    if (maxHeight != null) {
      mw.push(
        sizeMiddleware({
          padding: containerPadding,
          apply({ availableHeight, elements }) {
            const cappedHeight = Math.min(availableHeight, maxHeight);
            elements.floating.style.maxHeight = `${cappedHeight}px`;
          }
        })
      );
    }

    if (arrowRef?.current) {
      mw.push(
        arrowMiddleware({
          element: arrowRef.current as HTMLElement,
          padding: arrowBoundaryOffset
        })
      );
    }

    return mw;
  }, [
    offset,
    shouldFlip,
    containerPadding,
    maxHeight,
    arrowRef,
    arrowBoundaryOffset
  ]);

  const popper = usePopper({
    reference: targetRef.current,
    floating: overlayRef.current as HTMLElement | null,
    placement: requestedPlacement,
    strategy: 'absolute',
    middleware,
    open: isOpen,
    whileElementsMounted:
      shouldUpdatePosition && isOpen ? autoUpdate : undefined
  });

  const computedSide: Side | null = popper.isPositioned
    ? getSide(popper.placement)
    : null;

  const overlayStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = { ...popper.floatingStyles };

    if (crossOffset !== 0) {
      const side = getSide(popper.placement);
      const isVertical = side === 'top' || side === 'bottom';
      if (isVertical) {
        style.left =
          ((style.left as number) ?? 0) + crossOffset;
      } else {
        style.top =
          ((style.top as number) ?? 0) + crossOffset;
      }
    }

    return style;
  }, [popper.floatingStyles, popper.placement, crossOffset]);

  const arrowStyle = useMemo<CSSProperties>(() => {
    const arrowData = popper.middlewareData?.arrow as
      | { x?: number; y?: number; centerOffset?: number }
      | undefined;

    if (!arrowData) return {};

    const side = getSide(popper.placement);
    const style: CSSProperties = { position: 'absolute' };

    if (arrowData.x != null) {
      style.left = arrowData.x;
    }
    if (arrowData.y != null) {
      style.top = arrowData.y;
    }

    const staticSide: Record<Side, string> = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right'
    };
    style[staticSide[side] as keyof CSSProperties] = -4 as any;

    return style;
  }, [popper.middlewareData?.arrow, popper.placement]);

  const triggerAnchorPoint = useMemo(() => {
    const el = targetRef.current;
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }, [targetRef, popper.isPositioned]);

  const updatePosition = useCallback(() => {
    popper.update();
  }, [popper.update]);

  // Close when reference scrolls out of view
  useEffect(() => {
    if (!isOpen || !onClose || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          onClose();
        }
      },
      { threshold: 0 }
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [isOpen, onClose, targetRef]);

  return {
    overlayProps: { style: overlayStyle },
    arrowProps: { style: arrowStyle },
    placement: computedSide,
    triggerAnchorPoint,
    updatePosition
  };
}
