import type { ElementType } from 'react';
import type { ButtonProps } from '../Button/Button.types';

export type SnapchatButtonProps<T extends ElementType = 'button'> =
  ButtonProps<T> & {
    iconColor?: string | null;
  };
