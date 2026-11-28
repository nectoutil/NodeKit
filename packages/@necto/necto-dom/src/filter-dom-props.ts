/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { FilterOptions, FilterDOMProps, FilterDOMReturn } from './types';

const DOM_PROP_NAMES = new Set(['id']);

export function filterDOMProps(props: FilterDOMProps, options: FilterOptions): FilterDOMReturn {
  const allowedProps: Record<string, unknown> = {};

  for (const propName of Object.keys(props)) {
    if (
      DOM_PROP_NAMES.has(propName) ||
      (options.allowLabelableProps && options.allowedLabelableProps?.has(propName)) ||
      (options.allowLinkProps && options.allowedLinkProps?.has(propName)) ||
      options.additionalAllowedProps?.has(propName) ||
      propName.startsWith('data-')
    ) {
      allowedProps[propName] = props[propName as keyof typeof props];
    }
  }

  return allowedProps;
}
