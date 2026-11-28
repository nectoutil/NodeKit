/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Fragment } from 'react';
import { initTheme, withThemeDefaults } from '@necto/dom';

import { Script } from '../../Script';

import type { ReactElement } from 'react';
import type { ThemeConfig } from '@necto/dom';
import type { ThemeProviderProps } from './ThemeProvider.types';

export function ThemeProvider(props: ThemeProviderProps): ReactElement {
  const { children, ...options } = props;

  const config: ThemeConfig = withThemeDefaults(options);

  return (
    <Fragment>
      <Script id="necto-theme" script={initTheme} scriptArgs={[config]} />

      {children}
    </Fragment>
  );
}
