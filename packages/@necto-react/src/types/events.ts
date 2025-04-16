/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface HoverEvent {
  onHoverStart?: (event: HoverEvent) => void,
  onHoverEnd?: (event: HoverEvent) => void,
  onHoverChange?: (isHovering: boolean) => void
}