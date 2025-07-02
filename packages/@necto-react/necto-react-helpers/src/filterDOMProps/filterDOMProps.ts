/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
 */

// @botond-szabo Move this to the dom package.

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
    extraAllowedProps,
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
        extraAllowedProps?.has(propName) ||
        new RegExp(/^(data-.*)$/).test(propName))
    ) {
      allowedProps[propName] = props[propName as keyof typeof props];
    }
  }

  return allowedProps;
}
