import DefaultStyleDictionary from 'style-dictionary';

import { isColor } from "./filters/isColor";
import { isBorder } from "./filters/isBorder";
import { isDimension } from "./filters/isDimension";
import { isCubicBezier } from "./filters/isCubicBezier";
import { isColorWithAlpha } from "./filters/isColorWithAlpha";

// Filters
[
  { name: 'isColor', filter: isColor },
  { name: 'isBorder', filter: isBorder },
  { name: 'isDimension', filter: isDimension },
  { name: 'isCubicBezier', filter: isCubicBezier },
  { name: 'isColorWithAlpha', filter: isColorWithAlpha },
].forEach(({ name, filter }) => {
  StyleDictionary.registerFilter({ name, filter});
});

// Declare the constant first
const StyleDictionary = DefaultStyleDictionary;

// Export extendable Style Dictionary
export default StyleDictionary;

export {
  isColor,
  isBorder,
  isDimension,
  isCubicBezier,
  isColorWithAlpha
};
