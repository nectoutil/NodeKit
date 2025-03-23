import { isDimension } from "../filters/isDimension";
import { getTokenValue } from "../utilities/getTokenValue";

import type { PlatformConfig, Transform, TransformedToken } from 'style-dictionary/types';

export const dimensionToRem: Transform = {
  name: 'dimension/rem',
  type: `value`,
  transitive: true,
  filter: (token: TransformedToken) => {
    const tokenValue = getTokenValue(token)
    return isDimension(token) && tokenValue.substring(tokenValue.length - 2) === 'px'
  },
  transform: (token: TransformedToken, platform: PlatformConfig | undefined) => {
    const tokenValue = getTokenValue(token)
    const baseFont = platform?.basePxFontSize || 16
    const floatVal = parseFloat(tokenValue)

    if (isNaN(floatVal)) {
      throw `[__PACKAGE_NAME__]: Invalid Number: '${token.name}: ${tokenValue}' is not a valid number, cannot transform to rem \n`
    }

    if (floatVal === 0) {
      return '0'
    }

    return `${floatVal / baseFont}rem`
  },
}