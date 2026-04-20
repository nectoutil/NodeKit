/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { RefObject } from 'react';

/**
 * Options for the useAnimation hook.
 */
export interface UseAnimationOptions {
  /** A ref to the element being animated. */
  ref: RefObject<HTMLElement | null>;

  /** Whether the element is currently open/visible. Controls enter and exit animations. */
  isOpen: boolean;

  /** Whether the element is ready for the enter animation. @default true */
  isReady?: boolean;
}

/**
 * Return type for the useAnimation hook.
 */
export interface UseAnimationReturn {
  /** Whether the element is currently in the entering animation phase. */
  isEntering: boolean;

  /** Whether the element is currently in the exiting animation phase. */
  isExiting: boolean;

  /** Whether the element should be rendered (open or still exiting). */
  isRendered: boolean;
}
