import type { ElementType, ReactNode } from 'react';
import type { PrimitiveProps } from '../../Primitive/Primitive.types';

export interface GoogleButtonProps<E extends ElementType = 'button'>
  extends Omit<PrimitiveProps<E>, 'children'> {
  /**
   * The content to display in the button. Defaults to "Continue with Google"
   */
  children?: ReactNode;

  /**
   * Position of the Google logo icon
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Whether to show the Google logo icon
   * @default true
   */
  showIcon?: boolean;
}
