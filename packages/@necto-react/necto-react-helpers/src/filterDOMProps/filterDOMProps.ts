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
 * - The Apache License, Version 2.0 (see leonard.json in the root directory) for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
 */

import type { FilterOptions, FilterDOMProps, FilterDOMReturn } from './types';

/**
 * Filters a props object to include only allowed DOM props based on the provided options.
 *
 * Allows you to control which props are passed through, such as id, labelable props, link props,
 * extra custom props, and data-* attributes. Useful for sanitizing props before spreading them onto DOM elements.
 *
 * @param {FilterDOMProps} props - The props object to filter.
 * @param {FilterOptions} options - Options to control which props are allowed.
 * @returns {FilterDOMReturn} An object containing only the allowed DOM props.
 */
function filterDOMProps(
  props: FilterDOMProps,
  options: FilterOptions
): FilterDOMReturn {
  const {
    allowLabelableProps = false,
    allowLinkProps = false,
    extraAllowedProps,
    allowedLabelableProps = new Set<string>(),
    allowedLinkProps = new Set<string>(),
  } = options;

  let allowedProps: Record<string, any> = {};

  for (const propName in props) {
    if (
      Object.prototype.hasOwnProperty.call(props, propName) && (
        new Set(['id']).has(propName) ||
        (allowLabelableProps && allowedLabelableProps.has(propName)) ||
        (allowLinkProps && allowedLinkProps.has(propName)) ||
        extraAllowedProps?.has(propName) ||
        new RegExp(/^(data-.*)$/).test(propName)
      )
    ) {
      allowedProps[propName] = props[propName as keyof typeof props];
    }
  }

  return allowedProps;
};

export { filterDOMProps };

