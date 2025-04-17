/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  FocusEvent as ReactFocusEvent
} from 'react';

export interface HoverEvent {
  onHoverStart?: (event: HoverEvent) => void,
  onHoverEnd?: (event: HoverEvent) => void,
  onHoverChange?: (isHovering: boolean) => void
}

export interface FocusEvent<Target = Element> {
  onFocus?: (e: ReactFocusEvent<Target>) => void,
  onBlur?: (e: ReactFocusEvent<Target>) => void,
  onFocusChange?: (isFocused: boolean) => void
}