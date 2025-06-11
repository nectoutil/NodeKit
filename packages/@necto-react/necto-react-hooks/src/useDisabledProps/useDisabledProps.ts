/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useDisabled } from '../useDisabled';

import type { HTMLAttributes } from 'react';
import type { DisabledFlags } from '../useDisabled';

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

