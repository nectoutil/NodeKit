/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useDisabled } from '@necto-react/hooks';

import type { HTMLAttributes } from 'react';
import type {
  UseDisabledPropsProps,
  UseDisabledPropsReturn
} from './useDisabledProps.types';

/**
 * Returns HTML props with appropriate disabled attributes based on the disabled state.
 *
 * @param {UseDisabledPropsOptions} options - Options for the hook.
 * @returns {HTMLAttributes<HTMLElement>} The merged props including disabled and aria-disabled if applicable.
 */
export function useDisabledProps(
  props: UseDisabledPropsProps = {}
): UseDisabledPropsReturn {
  const { type = 'general', extraProps = {} } = props;
  const isDisabled = useDisabled({ type, defaultFallback: false });

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
