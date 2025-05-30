/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Portions of this code are based on the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications have been made to adapt the code for use in this project.
 */

import type { FilterOptions, FilterDOMProps, FilterDOMReturn } from './types';

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

