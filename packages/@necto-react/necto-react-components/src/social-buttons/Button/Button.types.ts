/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementType, ReactNode } from 'react';
import type { PrimitiveProps } from '../../Primitive/Primitive.types';
import type { Interpolation, Theme } from '@emotion/react';

export type ButtonProps<T extends ElementType = 'button'> =
  PrimitiveProps<T> & {
    children?: ReactNode;
    icon?: ReactNode;
    showIcon?: boolean;
    iconPosition?: 'left' | 'right';
    iconSize?: number;
    disabled?: boolean;
    css?: Interpolation<Theme>;
  };
