import Color from "@necto/color";
import { isColor } from "../filters/isColor";
import { getTokenValue } from "../utilities/getTokenValue";

import type { PlatformConfig, Transform, TransformedToken } from 'style-dictionary/types';

export const colorToHex: Transform = {
  name: 'color/hex',
  type: 'value',
  transitive: true,
  filter: isColor,
  transform: (token: TransformedToken, config: PlatformConfig) => {
    const alphaValue = token.alpha;
    const color = new Color(getTokenValue(token));
    if (alphaValue === null || alphaValue === undefined || alphaValue === 1) {
      return color.toHex();
    }
    color.setAlpha(alphaValue);
    return color.toHex();
  },
}