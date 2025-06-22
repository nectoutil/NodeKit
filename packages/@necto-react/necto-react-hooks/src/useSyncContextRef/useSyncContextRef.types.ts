/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RefObject } from 'react';

/**
 * Props for synchronizing a context ref with a local ref.
 *
 * @template T The type of the element or value referenced.
 */
export interface UseSyncContextRefProps<T> {
  /**
   * Optional context object containing a ref to synchronize.
   */
  context?: {
    ref?: RefObject<T | null>;
  };

  /**
   * Optional local ref to synchronize with the context ref.
   */
  ref?: RefObject<T | null>;
}
