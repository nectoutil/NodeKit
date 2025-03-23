import { getTokenValue } from '../utilities/getTokenValue.js'
import { isColorWithAlpha } from '../filters/isColorWithAlpha.js'

import type { Transform, TransformedToken } from 'style-dictionary/types'

export const colorAlphaToCss: Transform = {
  name: 'colorAlpha/css',
  type: 'value',
  transitive: true,
  filter: isColorWithAlpha,
  transform: (token: TransformedToken) => {
    if (!token.alpha && token.alpha !== 0) {
      return getTokenValue(token)
    }

    const colorA = getTokenValue(token)
    const colorB = 'transparent'
    const colorBPercent = 1 - token.alpha

    // Validate the alpha range
    if (colorBPercent < 0 || colorBPercent > 1) {
      throw new Error(
        `[__PACKAGE_NAME__]: Invalid argument for "cssColorMix", colorBPercent must be between 0 and 1, ${colorBPercent} provided.`
      )
    }
    if (colorBPercent === 0) {
      return colorA
    }
    if (colorBPercent === 1) {
      return colorB
    }

    return `color-mix(in srgb, ${colorA}, ${colorB} ${Math.round(colorBPercent * 100)}%)`
  },
}
