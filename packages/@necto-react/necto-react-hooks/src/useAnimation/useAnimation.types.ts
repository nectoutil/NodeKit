/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
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
