import { toHex, parseToRgba } from "@necto/color";
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
    if (alphaValue === null || alphaValue === undefined || alphaValue === 1) {
      return toHex(getTokenValue(token));
    }

    const [, , , alpha] = parseToRgba(color);

    return toHex(
      alpha(
        getTokenValue(token), alphaValue, token, config
      )
    )
  },
}
