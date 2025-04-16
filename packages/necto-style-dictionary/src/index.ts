import DefaultStyleDictionary from 'style-dictionary';

// Filters
import { isColor } from "./filters/isColor";
import { isBorder } from "./filters/isBorder";
import { isNumber } from './filters/isNumber';
import { isShadow } from './filters/isShadow';
import { isSource } from './filters/isSource';
import { isFromFile } from './filters/isFromFile';
import { isGradient } from './filters/isGradient';
import { isDuration } from "./filters/isDuration";
import { isDimension } from "./filters/isDimension";
import { isFontFamily } from './filters/isFontFamily';
import { isFontWeight } from './filters/isFontWeight';
import { isTypography } from "./filters/isTypography";
import { isCubicBezier } from "./filters/isCubicBezier";
import { isColorWithAlpha } from "./filters/isColorWithAlpha";

// Transformers
import { colorToHex } from './transformers/colorToHex';
import { borderToCss } from './transformers/borderToCss';
import { dimensionToRem } from './transformers/dimensionToRem';
import { colorAlphaToCss } from './transformers/colorAlphaToCss';
import { colorToRgbAlpha } from './transformers/colorToRgbAlpha';
import { namePathToDotNotation } from './transformers/namePathToDotNotation';

// Utilities
import { getTokenValue } from './utilities/getTokenValue';

// Declare the constant first
const StyleDictionary = DefaultStyleDictionary;

// Filters
StyleDictionary.registerFilter({
  name: 'isColor',
  filter: isColor
});

StyleDictionary.registerFilter({
  name: 'isBorder',
  filter: isBorder
});

StyleDictionary.registerFilter({
  name: 'isSource',
  filter: isSource
});

StyleDictionary.registerFilter({
  name: 'isShadow',
  filter: isShadow
});

StyleDictionary.registerFilter({
  name: 'isNumber',
  filter: isNumber
});

StyleDictionary.registerFilter({
  name: 'isGradient',
  filter: isGradient
});

StyleDictionary.registerFilter({
  name: 'isDuration',
  filter: isDuration
});

StyleDictionary.registerFilter({
  name: 'isDimension',
  filter: isDimension
});

StyleDictionary.registerFilter({
  name: 'isFontWeight',
  filter: isFontWeight
});

StyleDictionary.registerFilter({
  name: 'isFontFamily',
  filter: isFontFamily
});

StyleDictionary.registerFilter({
  name: 'isCubicBezier',
  filter: isCubicBezier
});

StyleDictionary.registerFilter({
  name: 'isColorWithAlpha',
  filter: isColorWithAlpha
});

StyleDictionary.registerFilter({
  name: 'isTypography',
  filter: isTypography
});

// Transformers
StyleDictionary.registerTransform({
  ...namePathToDotNotation
});

StyleDictionary.registerTransform({
  ...colorAlphaToCss
})

StyleDictionary.registerTransform({
  ...colorToHex
});

StyleDictionary.registerTransform({
  ...borderToCss
});

StyleDictionary.registerTransform({
  ...colorToRgbAlpha
});

StyleDictionary.registerTransform({
  ...dimensionToRem
});

// Export extendable Style Dictionary
export default StyleDictionary;

// Filters
export {
  isColor,
  isBorder,
  isNumber,
  isSource,
  isDuration,
  isFromFile,
  isGradient,
  isDimension,
  isCubicBezier,
  isColorWithAlpha
};

// Transformers
export {
  colorToHex,
  borderToCss,
  colorAlphaToCss,
  namePathToDotNotation
};

// Utilities
export {
  getTokenValue
}
