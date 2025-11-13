import type { ElementType } from 'react';
import type { ButtonProps } from '../Button/Button.types';

export type SlackButtonProps<T extends ElementType = 'button'> = ButtonProps<T>;
