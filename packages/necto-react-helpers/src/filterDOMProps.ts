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

import { LinkDOMProps } from '@necto-react/types';

interface FilterOptions {
  includeLabelableProps?: boolean;
  includeLinkProps?: boolean;
  additionalAllowedProps?: Set<string>;
  labelablePropsSet?: Set<string>;
  linkPropsSet?: Set<string>;
}

export function filterDOMProps(
  props: { id?: string } & LinkDOMProps,
  options: FilterOptions = {}
): { id?: string } {
  const {
    includeLabelableProps = false,
    includeLinkProps = false,
    additionalAllowedProps,
    labelablePropsSet = new Set<string>(),
    linkPropsSet = new Set<string>(),
  } = options;

  let allowedProps: Record<string, any> = {};

  for (const propName in props) {
    if (
      Object.prototype.hasOwnProperty.call(props, propName) && (
        new Set(['id']).has(propName) ||
        (includeLabelableProps && labelablePropsSet.has(propName)) ||
        (includeLinkProps && linkPropsSet.has(propName)) ||
        additionalAllowedProps?.has(propName) ||
        new RegExp(/^(data-.*)$/).test(propName)
      )
    ) {
      allowedProps[propName] = props[propName as keyof typeof props];
    }
  }

  return allowedProps;
}