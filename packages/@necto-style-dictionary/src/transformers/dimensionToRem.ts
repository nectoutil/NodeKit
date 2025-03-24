import { isDimension } from "../filters/isDimension";
import { getTokenValue } from "../utilities/getTokenValue";

import type { Config, PlatformConfig, Transform, TransformedToken } from 'style-dictionary/types';

const getBasePxFontSize = (options?: PlatformConfig): number => (options && options.basePxFontSize) || 16

export const dimensionToRem: Transform = {
  name: 'dimension/rem',
  type: 'value',
  transitive: true,
  filter: isDimension,
  transform: (token: TransformedToken, config: PlatformConfig, options: Config) => {
    const basePxFontSize = getBasePxFontSize(config)
    const hasUnit = (value: string | number, unit: string): boolean => {
      if (typeof value === 'number') {
        return false;
      }

      return String(value).indexOf(unit) > -1;
    };
    const valueProp = options.usesDtcg ? '$value' : 'value';
    const floatVal = parseFloat(token[valueProp]);

    if (isNaN(floatVal)) {
      throw new Error(
        `[__PACKAGE__NAME]: ]Invalid dimension token: '${token.name}: ${token[valueProp]}' is not valid and cannot be transformed to 'rem' \n`,
      );
    }

    if (floatVal === 0) {
      return '0';
    }

    if (hasUnit(token[valueProp], 'rem') || hasUnit(token[valueProp], 'em')) {
      return token[valueProp];
    }

    return `${floatVal / basePxFontSize}rem`;
  },
};