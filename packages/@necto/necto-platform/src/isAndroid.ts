// WARNING: This code is not recommended for use.
// It contains significant issues and may lead to unexpected behavior.
// Please avoid using or referencing this implementation.

function testUserAgent(re: RegExp) {
  if (typeof window === 'undefined' || window.navigator == null) {
    return false;
  }
  return (
    //@ts-ignore
    window.navigator.userAgentData?.brands.some(
      (brand: { brand: string; version: string }) => re.test(brand.brand)
    ) || re.test(window.navigator.userAgent)
  );
}

export const isAndroid = () => testUserAgent(/Android/i);
