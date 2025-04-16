import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isGradient
 * @type filter
 * @description Checks if token is of $type `gradient`
 */
export const isGradient = (token: TransformedToken): boolean => {
  return (token.$type ?? token.type) === 'gradient'
}
