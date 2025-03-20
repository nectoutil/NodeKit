import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isDimension
 * @type filter
 * @description Checks if token is of $type `dimension`
 */
export const isDimension = (token: TransformedToken): boolean => {
  return token.$type === 'dimension' || token.type === 'dimension'
}
