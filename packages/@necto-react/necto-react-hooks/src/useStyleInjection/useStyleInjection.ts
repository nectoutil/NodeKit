/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { injectStyle } from '@necto/dom';
import { useIsomorphicInsertionEffect } from '@necto-react/hooks';

import type { UseStyleInjectionProps } from './useStyleInjection.types';

export function useStyleInjection({
  id,
  css,
  insertionPoint,
  enabled = true,
  window: targetWindow = typeof window !== 'undefined' ? window : null
}: UseStyleInjectionProps): void {
  const cssString: string = Array.isArray(css) ? css.join('\n') : css;

  useIsomorphicInsertionEffect(() => {
    if (!enabled || !cssString) return;

    return injectStyle(cssString, { id, window: targetWindow, insertionPoint });
  }, [id, cssString, targetWindow, insertionPoint, enabled]);
}
