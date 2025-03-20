import DefaultStyleDictionary from 'style-dictionary';

import { isColor } from "./filters/color";
import { isBorder } from "./filters/border";
import { isDimension } from "./filters/dimension";
import { isCubicBezier } from "./filters/cubic-bezier";
import { isColorWithAlpha } from "./filters/color-with-alpha";

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
