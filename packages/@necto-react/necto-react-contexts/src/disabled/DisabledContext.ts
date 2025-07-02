/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext } from 'react';

import type { DisabledFlags } from '@necto-react/types';

/**
 * React context for managing disabled state flags across a component tree.
 */
export const DisabledContext = createContext<DisabledFlags>(
  new Object() as DisabledFlags
);
