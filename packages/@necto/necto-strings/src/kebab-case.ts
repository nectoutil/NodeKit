/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function kebabCase(str: string, keepLeadingDash = false): string {
  const result: string = str.replace(
    /\p{Lu}/gu,
    (match: string): string => `-${match.toLowerCase()}`
  );

  if (keepLeadingDash) {
    return result;
  }

  if (result.startsWith('-')) {
    return result.slice(1);
  }

  return result;
}

kebabCase.reverse = (str: string): string => {
  return str.replace(/-\p{Ll}/gu, (match: string): string =>
    match.slice(1).toUpperCase()
  );
};
