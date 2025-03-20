import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isBorder
 * @type filter
 * @description only returns tokens of type `border`
 */
export const isBorder = (token: TransformedToken): boolean => {
  return token.$type === 'border' || token?.type === 'border';
}
