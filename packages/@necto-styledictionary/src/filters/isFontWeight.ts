import type {TransformedToken} from 'style-dictionary/types'

/**
 * @name isFontWeight
 * @type filter
 * @description Checks if token is of $type `fontWeight`
 */
export const isFontWeight = (token: TransformedToken): boolean => {
  return token.$type === 'fontWeight' || token.type === 'fontWeight';
}
