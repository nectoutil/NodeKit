import type { ElementType, ReactNode } from 'react';
import type { PrimitiveProps } from '../../Primitive/Primitive.types';

export type SlackButtonProps<T extends ElementType = 'button'> =
  PrimitiveProps<T> & {
    children?: ReactNode;
    iconPosition?: 'left' | 'right';
    showIcon?: boolean;
    iconSize?: number;
    disabled?: boolean;
  };
