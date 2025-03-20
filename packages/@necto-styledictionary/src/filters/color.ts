import type { TransformedToken } from 'style-dictionary/types'

/**
 * @name isColor
 * @type filter
 * @description only returns tokens of type `color`
 */
export const isColor = (token: TransformedToken): boolean => {
  const typeValue = token.$type ?? token.type
  return typeValue === 'color'
}
