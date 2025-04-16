import { isBorder } from '../filters/isBorder';

import type { Transform, TransformedToken } from 'style-dictionary/types';

export const borderToCss: Transform = {
  name: 'border/css',
  type: 'value',
  transitive: true,
  filter: isBorder,
  transform: (token: TransformedToken) => {
    const value = token.$value ?? token.value;

    if (typeof value === 'string') {
      return value;
    }

    // Check if the value contains the necessary border properties
    if (!('color' in value && 'width' in value && 'style' in value)) {
      throw new Error(
        `[__PACKAGE_NAME__]: Invalid border token property ${JSON.stringify(value)}. Must be an object with color, width, and style properties.`,
      );
    }

    /* width | style | color */
    return `${value.width} ${value.style} ${value.color}`;
  },
};
