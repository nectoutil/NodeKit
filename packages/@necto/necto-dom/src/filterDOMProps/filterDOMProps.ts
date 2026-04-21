/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { FilterOptions, FilterDOMProps, FilterDOMReturn } from './types';

const DOM_PROP_NAMES = new Set(['id']);

/**
 * Filters a props object to include only allowed DOM props based on the provided options.
 *
 * @param {FilterDOMProps} props - The props object to filter.
 * @param {FilterOptions} options - Options to control which props are allowed.
 * @returns {FilterDOMReturn} An object containing only the allowed DOM props.
 */
export function filterDOMProps(
  props: FilterDOMProps,
  options: FilterOptions
): FilterDOMReturn {
  const {
    allowLabelableProps = false,
    allowLinkProps = false,
    additionalAllowedProps,
    allowedLabelableProps = new Set<string>(),
    allowedLinkProps = new Set<string>()
  } = options;

  const allowedProps: Record<string, unknown> = {};

  for (const propName in props) {
    if (
      Object.hasOwn(props, propName) &&
      (DOM_PROP_NAMES.has(propName) ||
        (allowLabelableProps && allowedLabelableProps.has(propName)) ||
        (allowLinkProps && allowedLinkProps.has(propName)) ||
        additionalAllowedProps?.has(propName) ||
        new RegExp(/^(data-.*)$/).test(propName))
    ) {
      allowedProps[propName] = props[propName as keyof typeof props];
    }
  }

  return allowedProps;
}
