import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isFontFamily
 * @type filter
 * @description Checks if token is of $type `isFontFamily`
 */
export const isFontFamily = (token: TransformedToken): boolean => {
  return token.$type === 'fontFamily' || token.type === 'fontFamily';
}
