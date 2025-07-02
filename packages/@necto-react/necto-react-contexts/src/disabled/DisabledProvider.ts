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

/**
 * Generates a unique, stable ID for React components, optionally with a custom prefix.
 *
 * @param {UseIdProps} [props] - Optional props object. You can provide a custom prefix and/or a defaultId.
 * @returns {UseIdReturn} The generated or provided unique ID.
 */
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
