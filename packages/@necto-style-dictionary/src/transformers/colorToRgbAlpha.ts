import Color from "@necto/color";
import { getTokenValue } from '../utilities/getTokenValue';
import { isColorWithAlpha } from "../filters/isColorWithAlpha";

import type { PlatformConfig, Transform, TransformedToken } from 'style-dictionary/types';

export const colorToRgbAlpha: Transform = {
  name: 'color/rgbAlpha',
  type: 'value',
  transitive: true,
  filter: isColorWithAlpha,
  transform: (token: TransformedToken, config: PlatformConfig) => {
    if (token.alpha === null) return getTokenValue(token)
    return new Color(getTokenValue(token)).alpha(token.alpha).toRgba();
  }
}