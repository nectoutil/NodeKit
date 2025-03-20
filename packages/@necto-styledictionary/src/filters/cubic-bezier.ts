import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isCubicBezier
 * @type filter
 * @description Checks if token is of $type `cubicBezier`
 */
export const isCubicBezier = (token: TransformedToken): boolean => {
  const typeValue = token.$type ?? token.type
  return typeValue === 'cubicBezier'
}
