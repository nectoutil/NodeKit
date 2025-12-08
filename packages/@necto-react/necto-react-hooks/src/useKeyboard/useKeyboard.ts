/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createEventHandler } from '@necto-react/helpers';
import type {
  UseKeyboardOptions,
  UseKeyboardReturn
} from './useKeyboard.types';

/**
 * React hook that provides keyboard event handlers based on the disabled state.
 *
 * @param {UseKeyboardOptions} options - Options controlling keyboard interaction.
 * @returns {UseKeyboardReturn} Object containing keyboard event handler props.
 */
export function useKeyboard(options: UseKeyboardOptions): UseKeyboardReturn {
  return {
    keyboardProps: options.isDisabled
      ? {}
      : {
          onKeyDown: options.onKeyDown
            ? createEventHandler((e) =>
                options.onKeyDown?.(e.nativeEvent as KeyboardEvent)
              )
            : undefined,
          onKeyUp: options.onKeyUp
            ? createEventHandler((e) =>
                options.onKeyUp?.(e.nativeEvent as KeyboardEvent)
              )
            : undefined
        }
  };
}
