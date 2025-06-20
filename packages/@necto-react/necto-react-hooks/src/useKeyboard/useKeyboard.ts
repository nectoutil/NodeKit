/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEventHandler } from '@necto-react/helpers';
import type { UseKeyboardProps, UseKeyboardReturn } from './useKeyboard.types';

/**
 * React hook that provides keyboard event handlers based on the disabled state.
 *
 * @param {UseKeyboardProps} props - Props controlling keyboard interaction.
 * @returns {UseKeyboardReturn} Object containing keyboard event handler props.
 */
export function useKeyboard(props: UseKeyboardProps): UseKeyboardReturn {
  return {
    keyboardProps: props.isDisabled
      ? {}
      : {
          onKeyDown: props.onKeyDown
            ? createEventHandler((e) =>
                props.onKeyDown?.(e.nativeEvent as KeyboardEvent)
              )
            : undefined,
          onKeyUp: props.onKeyUp
            ? createEventHandler((e) =>
                props.onKeyUp?.(e.nativeEvent as KeyboardEvent)
              )
            : undefined
        }
  };
}
