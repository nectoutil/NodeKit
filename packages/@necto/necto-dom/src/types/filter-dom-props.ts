/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { LinkDOMProps } from '@necto-react/types';

export interface FilterOptions {
  allowLinkProps?: boolean;
  allowLabelableProps?: boolean;
  allowedLinkProps?: Set<string>;
  allowedLabelableProps?: Set<string>;
  additionalAllowedProps?: Set<string>;
}

export interface FilterDOMProps extends LinkDOMProps {
  id?: string;
}

export interface FilterDOMReturn {
  id?: string;
}
