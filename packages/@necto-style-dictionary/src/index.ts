import DefaultStyleDictionary from 'style-dictionary';

// Filters
import { isColor } from "./filters/isColor";
import { isBorder } from "./filters/isBorder";
import { isFromFile } from './filters/isFromFile';
import { isDuration } from "./filters/isDuration";
import { isDimension } from "./filters/isDimension";
import { isFontFamily } from './filters/isFontFamily';
import { isFontWeight } from './filters/isFontWeight';
import { isCubicBezier } from "./filters/isCubicBezier";
import { isColorWithAlpha } from "./filters/isColorWithAlpha";

// Transformers
import { namePathToDotNotation } from './transformers/namePathToDotNotation';

// Utilities
import { getTokenValue } from './utilities/getTokenValue';

// Declare the constant first
const StyleDictionary = DefaultStyleDictionary;

// Filters
[
  { name: 'isColor', filter: isColor },
  { name: 'isBorder', filter: isBorder },
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

// Export extendable Style Dictionary
export default StyleDictionary;

// Filters
export {
  isColor,
  isBorder,
  isDimension,
  isCubicBezier,
  isColorWithAlpha
};

// Transformers
export {
  namePathToDotNotation
};

// Utilities
export {
  getTokenValue
}
