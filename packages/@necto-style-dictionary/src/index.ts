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
import { isCubicBezier } from "./filters/isCubicBezier";
import { isColorWithAlpha } from "./filters/isColorWithAlpha";

// Transformers
import { colorAlphaToCss } from './transformers/colorAlphaToCss';
import { namePathToDotNotation } from './transformers/namePathToDotNotation';

// Utilities
import { getTokenValue } from './utilities/getTokenValue';

// Declare the constant first
const StyleDictionary = DefaultStyleDictionary;

// Filters
[
  { name: 'isColor', filter: isColor },
  { name: 'isBorder', filter: isBorder },
  { name: 'isSource', filter: isSource },
  { name: 'isShadow', filter: isShadow },
  { name: 'isNumber', filter: isNumber },
  { name: 'isGradient', filter: isGradient },
  { name: 'isDuration', filter: isDuration },
  // { name: 'isFromFile', filter: isFromFile },
  { name: 'isDimension', filter: isDimension },
  { name: 'isFontWeight', filter: isFontWeight },
  { name: 'isFontFamily', filter: isFontFamily },
  { name: 'isCubicBezier', filter: isCubicBezier },
  { name: 'isColorWithAlpha', filter: isColorWithAlpha },
].forEach(({ name, filter }) => {
  StyleDictionary.registerFilter({ name, filter});
});

// Transformers
[
  colorAlphaToCss,
  namePathToDotNotation
].forEach((transformer) => {
  StyleDictionary.registerTransform(transformer);
});

// Export extendable Style Dictionary
export default StyleDictionary;

// Filters
export {
  isColor,
  isBorder,
  isNumber,
  isGradient,
  isDimension,
  isCubicBezier,
  isColorWithAlpha
};

// Transformers
export {
  colorAlphaToCss,
  namePathToDotNotation
};

// Utilities
export {
  getTokenValue
}
