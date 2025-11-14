/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';

import type { AriaAttributes } from 'react';
import type {
  UseAriaPropsProps,
  UseAriaPropsReturn
} from './useAriaProps.types';

/**
 * Returns ARIA attributes based on the provided state flags.
 * Automatically filters out undefined values to avoid adding empty ARIA attributes.
 *
 * @param {UseAriaPropsProps} props - State flags to convert to ARIA attributes.
 * @returns {UseAriaPropsReturn} The ARIA attributes object with only defined values.
 */
export function useAriaProps(
  props: UseAriaPropsProps = {}
): UseAriaPropsReturn {
  const {
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    isBusy,
    isPressed,
    isExpanded,
    isSelected,
    isChecked,
    isHidden,
    hasPopup,
    valueCurrent,
    valueMin,
    valueMax,
    valueText
  } = props;

  return useMemo((): AriaAttributes => {
    const ariaProps: Record<string, any> = {};

    const booleanMapping: Array<{
      value: boolean | undefined;
      attr: string;
    }> = [
      { value: isInvalid, attr: 'aria-invalid' },
      { value: isDisabled, attr: 'aria-disabled' },
      { value: isReadOnly, attr: 'aria-readonly' },
      { value: isRequired, attr: 'aria-required' },
      { value: isBusy, attr: 'aria-busy' },
      { value: isExpanded, attr: 'aria-expanded' },
      { value: isSelected, attr: 'aria-selected' },
      { value: isHidden, attr: 'aria-hidden' }
    ];

    for (const { value, attr } of booleanMapping) {
      if (value !== undefined) {
        ariaProps[attr] = value || undefined;
      }
    }

    if (isPressed !== undefined) {
      ariaProps['aria-pressed'] = isPressed === false ? undefined : isPressed;
    }

    if (isChecked !== undefined) {
      ariaProps['aria-checked'] = isChecked === false ? undefined : isChecked;
    }

    if (hasPopup !== undefined) {
      ariaProps['aria-haspopup'] = hasPopup === false ? undefined : hasPopup;
    }

    if (valueCurrent !== undefined) {
      ariaProps['aria-valuenow'] = valueCurrent;
    }

    if (valueMin !== undefined) {
      ariaProps['aria-valuemin'] = valueMin;
    }

    if (valueMax !== undefined) {
      ariaProps['aria-valuemax'] = valueMax;
    }

    if (valueText !== undefined) {
      ariaProps['aria-valuetext'] = valueText;
    }

    return ariaProps;
  }, [
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    isBusy,
    isPressed,
    isExpanded,
    isSelected,
    isChecked,
    isHidden,
    hasPopup,
    valueCurrent,
    valueMin,
    valueMax,
    valueText
  ]);
}
