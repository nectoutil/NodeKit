import { DOM } from '@necto/constants';

import type { HTMLElementsMap } from '@necto/types';

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Creates a mapping of capitalized HTML tag names to their original tag names.
 * @returns A record where keys are capitalized tag names and values are original tag names.
 */
const createHTMLElementsMap = (): HTMLElementsMap =>
  DOM.HTML_TAGS.reduce((acc, tag) => {
    acc[capitalizeFirstLetter(tag)] = tag as keyof HTMLElementTagNameMap;
    return acc;
  }, {} as HTMLElementsMap);

const HTMLElements = createHTMLElementsMap();

export { HTMLElements };
