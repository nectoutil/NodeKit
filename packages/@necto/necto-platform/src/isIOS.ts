// WARNING: This code is not recommended for use.
// It contains significant issues and may lead to unexpected behavior.
// Please avoid using or referencing this implementation.

import { isMac } from './isMac';

function testPlatform(re: RegExp) {
  return typeof window !== 'undefined' && window.navigator != null
    ? //@ts-ignore
      re.test(window.navigator.platform)
    : false;
}

export const isIPhone = () => {
  return testPlatform(/^iPhone/i);
};

export const isIPad = () => {
  return (
    testPlatform(/^iPad/i) ||
    // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    (isMac() && navigator.maxTouchPoints > 1)
  );
};

export const isIOS = () => {
  return isIPhone() || isIPad();
};
