/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Props for the useScrollLock hook.
 */
export interface UseScrollLockProps {
  /** Whether to automatically lock scroll on mount. */
  autoLock?: boolean;

  /** The target element to lock scrolling on. Can be an HTMLElement or a CSS selector string. Defaults to document.body. */
  target?: HTMLElement | string;

  /** Whether to add padding to prevent layout shift when scrollbar is hidden. */
  widthReflow?: boolean;
}

/**
 * Return type for the useScrollLock hook.
 */
export interface UseScrollLockReturn {
  /** Whether scroll is currently locked. */
  isLocked: boolean;

  /** Function to lock scrolling. */
  lock: () => void;

  /** Function to unlock scrolling. */
  unlock: () => void;
}
