/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ElementType } from 'react';
import type { ButtonProps } from '../Button/Button.types';

export type DropboxButtonProps<T extends ElementType = 'button'> =
  ButtonProps<T>;
