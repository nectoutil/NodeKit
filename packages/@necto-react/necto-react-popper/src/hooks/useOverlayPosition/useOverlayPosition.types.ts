/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CSSProperties, RefObject } from 'react';
import type { PositionProps, Side } from '@necto/popper';

export interface UseOverlayPositionOptions extends PositionProps {
  targetRef: RefObject<Element | null>;
  overlayRef: RefObject<Element | null>;
  arrowRef?: RefObject<Element | null>;
  scrollRef?: RefObject<Element | null>;
  isOpen?: boolean;
  onClose?: (() => void) | null;
  shouldUpdatePosition?: boolean;
}

export interface UseOverlayPositionReturn {
  overlayProps: { style: CSSProperties };
  arrowProps: { style: CSSProperties };
  placement: Side | null;
  triggerAnchorPoint: { x: number; y: number } | null;
  updatePosition: () => void;
}
