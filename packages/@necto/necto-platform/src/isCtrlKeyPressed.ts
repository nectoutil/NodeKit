/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isMac } from './isMac';

/**
 * Checks if the Ctrl key (or Cmd on Mac) is pressed.
 * On Mac, the Cmd key is used instead of Ctrl for most shortcuts.
 *
 * @param event - The keyboard or mouse event to check.
 * @returns True if Ctrl (or Cmd on Mac) is pressed.
 */
export function isCtrlKeyPressed(event: {
  ctrlKey?: boolean;
  metaKey?: boolean;
}): boolean {
  return isMac() ? (event.metaKey ?? false) : (event.ctrlKey ?? false);
}
