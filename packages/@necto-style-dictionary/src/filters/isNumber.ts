import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isNumber
 * @type filter
 * @description Checks if token type is a number
 */
export const isNumber = (token: TransformedToken): boolean => {
  return (token.$type ?? token.type) === 'number';
}
