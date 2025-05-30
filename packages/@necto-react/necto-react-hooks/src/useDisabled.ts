import { createContext, createElement, useContext, useMemo } from 'react';

import type { HTMLAttributes, PropsWithChildren } from 'react';

type DisabledFlags = {
  general?: boolean;
  form?: boolean;
  interactions?: boolean;
  [key: string]: boolean | undefined;
};

const DisabledContext = createContext<DisabledFlags>({});

export function useDisabledFlags(): DisabledFlags {
  return useContext(DisabledContext) || {};
}

export function useDisabled(
  type: keyof DisabledFlags = 'general',
  defaultFallback = false
): boolean {
  const flags = useDisabledFlags();
  return flags[type] ?? defaultFallback;
}

export function useDisabledProps(
  type: keyof DisabledFlags = 'general',
  extraProps: HTMLAttributes<HTMLElement> = {}
): HTMLAttributes<HTMLElement> {
  const isDisabled = useDisabled(type);

  return useMemo(() => {
    let props: HTMLAttributes<HTMLElement> = {
      ...extraProps
    };

    if (isDisabled) {
      props = {
        ...props,
        ...(typeof extraProps.onClick === 'function' ||
        typeof extraProps.onChange === 'function'
          ? { disabled: isDisabled }
          : {}),
        'aria-disabled': isDisabled
      };
    }

    return props;
  }, [isDisabled, extraProps]);
}

export function DisabledProvider({
  value,
  children
}: PropsWithChildren<{ value?: DisabledFlags }>) {
  return createElement(
    DisabledContext.Provider,
    { value: value || {} },
    children
  );
}
