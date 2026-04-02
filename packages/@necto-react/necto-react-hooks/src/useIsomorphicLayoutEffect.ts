/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useLayoutEffect } from 'react';

/**
 * SSR-safe useLayoutEffect. Falls back to useEffect on the server
 * to avoid React warnings about useLayoutEffect during SSR.
 */
export const useIsomorphicLayoutEffect: typeof useLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
