/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import React from 'react';

import type { JSXElementConstructor, ComponentProps, ReactNode, ReactElement } from 'react';

export function mergeReactProps<
  TTag extends keyof React.JSX.IntrinsicElements | JSXElementConstructor<any>,
  TSlot = {},
  TOmittableProps extends PropertyKey = never,
  Overrides = {}
>(
  ...listOfProps: Array<
    Omit<ComponentProps<TTag>, TOmittableProps | 'as' | 'children' | 'refName' | 'className'> &
      {
        as?: TTag;
        children?: ReactNode | ((bag: TSlot) => ReactElement);
        refName?: string;
        className?: ComponentProps<TTag>['className'] | ((bag: TSlot) => string);
      } &
      Overrides
  >
): ComponentProps<TTag> & Overrides {
  if (listOfProps.length === 0) return {} as ComponentProps<TTag> & Overrides;
  if (listOfProps.length === 1) return listOfProps[0] as ComponentProps<TTag> & Overrides;

  const target: Partial<ComponentProps<TTag> & Overrides> = {};
  const eventHandlers: Record<string, ((...args: any[]) => void)[]> = {};

  for (const props of listOfProps) {
    for (const prop in props) {
      if (prop === 'children') continue;

      if (prop.startsWith('on') && typeof props[prop as keyof typeof props] === 'function') {
        eventHandlers[prop] ??= [];
        eventHandlers[prop].push((props as Record<string, unknown>)[prop] as (...args: any[]) => void);
      } else {
        (target as Record<string, unknown>)[prop] = props[prop as keyof typeof props];
      }
    }
  }

  for (const eventName in eventHandlers) {
    (target as Record<string, unknown>)[eventName] = (...args: any[]) => {
      for (const handler of eventHandlers[eventName]) {
        handler?.(...args);
      }
    };
  }

  const lastProps = listOfProps[listOfProps.length - 1];
  if ('children' in lastProps) {
    (target as Record<string, unknown>)['children'] = lastProps.children;
  }

  return target as ComponentProps<TTag> & Overrides;
}
