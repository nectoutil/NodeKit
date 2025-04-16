import parseToRgba from "../parsers/parseToRgba";

function toRgbaArray(color: string): number[] {
  const [red, green, blue, alpha] = parseToRgba(color);

  const clampedValues = [red, green, blue].map(value => Math.min(Math.max(0, value), 255));
  const clampedAlpha = parseFloat(Math.min(Math.max(0, alpha), 1).toFixed(3));

  return [...clampedValues, clampedAlpha];
}

export default toRgbaArray;