import parseToRgba from '../parsers/parseToRgba';

/**
 * Takes in any color and returns it as an rgba string.
 */
function toRgba(color: string): string {
  const [red, green, blue, alpha] = parseToRgba(color);

  const values = [red, green, blue];
  const clampedValues = values.map((value) =>
    Math.min(Math.max(0, value), 255).toFixed()
  );

  const clampedAlpha = Number.parseFloat(
    Math.min(Math.max(0, alpha), 1).toFixed(3)
  );

  return `rgba(${clampedValues.join(', ')}, ${clampedAlpha})`;
}

export default toRgba;
