/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { UseThemeReturn } from '@necto-react/hooks';

export interface ThemeTogglerRenderProps extends UseThemeReturn {
  /** Sets an explicit theme, or flips light/dark when called with no argument. */
  toggleTheme: (next?: string) => void;
}

export interface ThemeTogglerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /**
   * Button content, or a render function that receives the theme API and
   * returns custom markup (no default button is rendered in that case).
   */
  children?: ReactNode | ((api: ThemeTogglerRenderProps) => ReactNode);
}
