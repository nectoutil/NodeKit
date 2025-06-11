/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HoverEvent, DOMAttributes } from '@necto-react/types';

/**
 * Props for the useHover hook.
 */
export interface UseHoverProps extends HoverEvent {
  /** Whether hover events are disabled. */
  isDisabled?: boolean;

  /** Called when a hover interaction starts. */
  onHoverStart?: (event: HoverEvent) => void;

  /** Called when a hover interaction ends. */
  onHoverEnd?: (event: HoverEvent) => void;

  /** Called when the hover state changes. */
  onHoverChange?: (isHovered: boolean) => void;
}

/**
 * Return type for the useHover hook.
 */
export interface UseHoverReturn {
  /** Props that can be passed on to render in the DOM. */
  hoverProps: DOMAttributes;

  /** Wether the current context is hovered or not. */
  isHovered: boolean;
}
