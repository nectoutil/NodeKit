/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Fragment } from 'react';
import { useTheme } from '@necto-react/hooks';

import { Primitive } from '../../Primitive';

import type { MouseEvent, ReactElement } from 'react';
import type { ThemeTogglerProps, ThemeTogglerRenderProps } from './ThemeToggler.types';

/**
 * Toggles the theme. Renders a default button, or — when `children` is a render
 * function — hands it the theme API and renders whatever it returns.
 */
export function ThemeToggler(props: ThemeTogglerProps): ReactElement {
  const { children, onClick, ...rest } = props;

  const { theme, themes, setTheme, systemTheme, forcedTheme, resolvedTheme } = useTheme();

  const toggleTheme = (next?: string): void => {
    setTheme(next ?? (resolvedTheme === 'dark' ? 'light' : 'dark'));
  };

  if (typeof children === 'function') {
    const api: ThemeTogglerRenderProps = {
      theme,
      themes,
      setTheme,
      systemTheme,
      forcedTheme,
      toggleTheme,
      resolvedTheme
    };

    return <Fragment>{children(api)}</Fragment>;
  }

  return (
    <Primitive.Button
      {...rest}
      onClick={(event: MouseEvent<HTMLButtonElement>): void => {
        toggleTheme();
        onClick?.(event);
      }}
    >
      {children}
    </Primitive.Button>
  );
}
