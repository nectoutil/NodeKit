/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { createContext, createElement, useContext, useMemo } from "react";

import type { HTMLAttributes, PropsWithChildren} from "react";

type DisabledFlags = {
  general?: boolean;
  form?: boolean;
  interactions?: boolean;
  [key: string]: boolean | undefined;
};

let DisabledContext = createContext<DisabledFlags>({});

export function useDisabledFlags(): DisabledFlags {
  return useContext(DisabledContext) || {};
};

export function useDisabled(
  type: keyof DisabledFlags = 'general',
  defaultFallback: boolean = false
): boolean {
  const flags = useContext(DisabledContext) || {};
  return flags[type] ?? defaultFallback;
}

export function useDisabledProps(type: keyof DisabledFlags = 'general', extraProps: HTMLAttributes<HTMLElement> = {}): HTMLAttributes<HTMLElement> {
  const isDisabled = useDisabled(type);

  return useMemo(() => {
    let props: HTMLAttributes<HTMLElement> = {
      ...extraProps
    };

    if (isDisabled) {
      props = {
        ...props,
        ...(typeof extraProps.onClick === 'function' || typeof extraProps.onChange === 'function' ? { disabled: isDisabled } : {}),
        'aria-disabled': isDisabled
      };
    }

    return props;
  }, [isDisabled, extraProps]);
};

export function DisabledProvider({
  value,
  children,
}: PropsWithChildren<{ value?: DisabledFlags }>) {
  return createElement(
    DisabledContext.Provider,
    { value: value || {} },
    children
  );
}