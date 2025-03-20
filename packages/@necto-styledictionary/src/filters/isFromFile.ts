import type { TransformedToken } from 'style-dictionary/types';

/**
 * @name isFromFile
 * @type filter
 * @description Checks if token comes from a specific file
 */
export const isFromFile = (token: TransformedToken, files: string[]): boolean => {
  return files?.includes(token.filePath) === true
}
