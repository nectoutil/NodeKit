/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useLayoutEffect } from 'react';

export const useIsomorphicInsertionEffect: typeof useLayoutEffect =
  (React as any)['useInsertionEffect'] ?? useLayoutEffect;
