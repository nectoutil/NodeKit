import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isDuration
 * @type filter
 * @description Checks if token is of $type `duration`
 */
export const isDuration = (token: TransformedToken): boolean => {
  return token.$type === 'duration' || token.type === 'duration';
}
