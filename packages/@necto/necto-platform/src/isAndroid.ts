/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// WARNING: This code is not recommended for use.
// It contains significant issues and may lead to unexpected behavior.
// Please avoid using or referencing this implementation.

function testUserAgent(re: RegExp) {
  if (typeof window === 'undefined' || window.navigator == null) {
    return false;
  }
  return (
    //@ts-expect-error
    window.navigator.userAgentData?.brands.some(
      (brand: { brand: string; version: string }) => re.test(brand.brand)
    ) || re.test(window.navigator.userAgent)
  );
}

export const isAndroid = () => testUserAgent(/Android/i);
