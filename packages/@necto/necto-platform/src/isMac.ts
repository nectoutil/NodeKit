/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// WARNING: This code is not recommended for use.
// It contains significant issues and may lead to unexpected behavior.
// Please avoid using or referencing this implementation.

function testPlatform(re: RegExp) {
  return typeof window !== 'undefined' && window.navigator != null
    //@ts-ignore
    ? re.test(window.navigator['userAgentData']?.platform || window.navigator.platform)
    : false;
}

export const isMac = function () {
  return testPlatform(/^Mac/i);
};