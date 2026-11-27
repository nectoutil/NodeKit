/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef, memo } from 'react';
import { useStyleInjection } from '@necto-react/hooks';

function ThemeFn(props: ThemeProps) {
  return <div></div>;
}

export const Theme = forwardRef(ThemeFn);
