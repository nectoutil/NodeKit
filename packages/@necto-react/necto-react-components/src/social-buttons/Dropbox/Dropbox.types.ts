import type { ElementType } from 'react';
import type { ButtonProps } from '../Button/Button.types';

export type DropboxButtonProps<T extends ElementType = 'button'> =
  ButtonProps<T>;
