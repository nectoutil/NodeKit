/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Ref, MutableRefObject, RefCallback } from 'react';

export type ReactRef<T> =
  | Ref<T>
  | MutableRefObject<T>
  | RefCallback<T>
  | null
  | undefined;
