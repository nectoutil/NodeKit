/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createElement } from 'react';
import { DisabledContext } from './DisabledContext';

import type { PropsWithChildren } from 'react';
import type { DisabledFlags } from '@necto-react/types';

export function DisabledProvider({
  value,
  children
}: PropsWithChildren<{ value?: DisabledFlags }>) {
  return createElement(
    DisabledContext.Provider,
    { value: value || (new Object() as DisabledFlags) },
    children
  );
}
