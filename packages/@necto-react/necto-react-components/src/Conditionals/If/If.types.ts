/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ReactNode } from 'react';

export interface IfProps {
  condition: boolean | (() => boolean);
  keepAlive?: boolean;
  children: ReactNode | Array<ReactNode>;
}
