import { isColor } from './is-color';

import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isColorWithAlpha
 * @type filter
 * @description Checks if token is color with an alpha value
 */
export const isColorWithAlpha = (token: TransformedToken): boolean => {
  return isColor(token) && token.alpha !== undefined && typeof token.alpha === 'number'
}
