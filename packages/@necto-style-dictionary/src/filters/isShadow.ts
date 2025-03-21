import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isShadow
 * @type filter
 * @description Checks if token is of $type `shadow`
 */
export const isShadow = (token: TransformedToken): boolean => {
  return (token.$type ?? token.type) === 'shadow'
}
