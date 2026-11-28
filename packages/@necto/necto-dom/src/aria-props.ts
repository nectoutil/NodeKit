/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DOM } from '@necto/constants';

const ariaPropsSet: Set<string> = new Set(DOM.ARIA_ATTRIBUTES);

export const AriaProps: Record<string, string> = DOM.ARIA_ATTRIBUTES.reduce(
  (props, attr) => {
    const name: string = attr.replace('aria-', '');

    props[name.charAt(0).toUpperCase() + name.slice(1)] = attr;
    return props;
  },
  {} as Record<string, string>
);

export const isAriaAttribute = (prop: string): boolean => {
  return ariaPropsSet.has(prop);
};

export const hasAriaPrefix = (prop: string): boolean => {
  return prop.startsWith('aria-');
};
