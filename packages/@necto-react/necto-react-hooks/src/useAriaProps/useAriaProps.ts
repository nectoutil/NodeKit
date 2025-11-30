// biome-ignore-all lint/suspicious/noExplicitAny: Any for aria props is fine.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';

import { AriaProps } from '@necto/dom';

import type {
  UseAriaPropsProps,
  UseAriaPropsReturn
} from './useAriaProps.types';
import type { AriaAttributes } from 'react';

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
    const ariaAttributes: Record<string, any> = {};

    const booleanMapping: Array<{
      value: boolean | undefined;
      attr: string;
    }> = [
      { value: isInvalid, attr: AriaProps.Invalid },
      { value: isDisabled, attr: AriaProps.Disabled },
      { value: isReadOnly, attr: AriaProps.Readonly },
      { value: isRequired, attr: AriaProps.Required },
      { value: isBusy, attr: AriaProps.Busy },
      { value: isExpanded, attr: AriaProps.Expanded },
      { value: isSelected, attr: AriaProps.Selected },
      { value: isHidden, attr: AriaProps.Hidden }
    ];

    for (const { value, attr } of booleanMapping) {
      if (value !== undefined) {
        ariaAttributes[attr] = value || undefined;
      }
    }

    if (isPressed !== undefined) {
      ariaAttributes[AriaProps.Pressed] =
        isPressed === false ? undefined : isPressed;
    }

    if (isChecked !== undefined) {
      ariaAttributes[AriaProps.Checked] =
        isChecked === false ? undefined : isChecked;
    }

    if (hasPopup !== undefined) {
      ariaAttributes[AriaProps.Haspopup] =
        hasPopup === false ? undefined : hasPopup;
    }

    if (valueCurrent !== undefined) {
      ariaAttributes[AriaProps.Valuenow] = valueCurrent;
    }

    if (valueMin !== undefined) {
      ariaAttributes[AriaProps.Valuemin] = valueMin;
    }

    if (valueMax !== undefined) {
      ariaAttributes[AriaProps.Valuemax] = valueMax;
    }

    if (valueText !== undefined) {
      ariaAttributes[AriaProps.Valuetext] = valueText;
    }

    return ariaAttributes;
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
