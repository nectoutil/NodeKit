import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isSource
 * @type filter
 * @description Checks if token is source token
 */
export const isSource = (token: TransformedToken): boolean => {
  return token.isSource === true;
}
