import { namePathToDotNotation } from '../index';

import type { TransformedToken } from 'style-dictionary/types';

const composeValuePropertyErrorMessage = (token: TransformedToken, property: string) => {
  const originalValue = token.original.$value ?? token.original.value;
  const value = token.$value ?? token.value;

  return `[__PACKAGE_NAME__] Invalid property "${property}" of token "${namePathToDotNotation.transform(token, {}, {})}" in file "${
    token.filePath
  }". Transformed property value: "${value?.[property]}". ${
    originalValue ? `Original value: "${originalValue?.[property]}" ` : ''
  }This may be due to referencing a token that does not exist.`;
}

export class invalidTokenValuePropertyError extends Error {
  constructor(token: TransformedToken, property: string) {
    super(composeValuePropertyErrorMessage(token, property));
    Error.captureStackTrace(this, invalidTokenValuePropertyError);
  }
}


export const getTokenValue = (token: TransformedToken, property?: string) => {
  const value = token.$value ?? token.value;


  if (typeof property === 'string' && (value as any)[property] === undefined) { // Use type assertion to allow property access
    throw new invalidTokenValuePropertyError(token, property)
  }

  if (typeof property === 'string') {
    return (value as any)[property] // Use type assertion here as well
  }

  return value;
}
