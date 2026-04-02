/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ReactNode } from 'react';

export interface PopperPortalProps {
  /**
   * Custom portal ID.
   */
  id?: string;

  /**
   * Custom root element.
   */
  root?: HTMLElement | null;

  /**
   * Whether to preserve tab order.
   * @default true
   */
  preserveTabOrder?: boolean;

  /**
   * Children to render in the portal.
   */
  children: ReactNode;
}
