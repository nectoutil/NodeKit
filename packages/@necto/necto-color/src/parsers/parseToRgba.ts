import colorNames from 'color-name';

function parseToRgba(color: string): Array<number> {
  if (typeof color !== 'string') {
    throw new Error('[__PACKAGE_NAME__]: This is not a valid color');
  }

  if (color.trim().toLowerCase() === 'transparent') return [0, 0, 0, 0];

  let normalizedColor = color.trim();
  normalizedColor = /^[a-z]+$/i.test(color) ? nameToHex(color) : color;

  const reducedHexMatch = new RegExp(/^#([a-f0-9])([a-f0-9])([a-f0-9])$/i).exec(
    normalizedColor
  );
  if (reducedHexMatch) {
    return [
      ...reducedHexMatch
        .slice(1, 4)
        .map((char) => Number.parseInt(char + char, 16)),
      1
    ];
  }

  const fullHexMatch = new RegExp(
    /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i
  ).exec(normalizedColor);
  if (fullHexMatch) {
    return [
      ...fullHexMatch.slice(1, 4).map((hex) => Number.parseInt(hex, 16)),
      1
    ];
  }

  const reducedHexWithAlphaMatch = new RegExp(
    /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i
  ).exec(normalizedColor);
  if (reducedHexWithAlphaMatch) {
    return [
      ...reducedHexWithAlphaMatch
        .slice(1, 4)
        .map((char) => Number.parseInt(char + char, 16)),
      Number.parseInt(
        reducedHexWithAlphaMatch[4] + reducedHexWithAlphaMatch[4],
        16
      ) / 255
    ];
  }

  const hexWithAlphaMatch = new RegExp(
    /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i
  ).exec(normalizedColor);
  if (hexWithAlphaMatch) {
    return [
      ...hexWithAlphaMatch.slice(1, 4).map((hex) => Number.parseInt(hex, 16)),
      Number.parseInt(hexWithAlphaMatch[4], 16) / 255
    ];
  }

  const rgbaMatch =
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i.exec(
      normalizedColor
    );
  if (rgbaMatch) {
    const [_, r, g, b, a = '1'] = rgbaMatch;
    return [
      Number.parseInt(r, 10),
      Number.parseInt(g, 10),
      Number.parseInt(b, 10),
      Number.parseFloat(a)
    ];
  }

  const hslaMatch = new RegExp(
    /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+(?:\.\d+)?))?\s*\)$/i
  ).exec(normalizedColor);
  if (hslaMatch) {
    const [h, s, l, a] = hslaMatch.slice(1).map(Number.parseFloat);
    if (Math.min(Math.max(0, s), 100) !== s)
      throw new Error(`[__PACKAGE_NAME__]: Invalid saturation value: ${s}`);
    if (Math.min(Math.max(0, l), 100) !== l)
      throw new Error(`[__PACKAGE_NAME__]: Invalid lightness value: ${l}`);
    return [...hslToRgb(h, s, l), Number.isNaN(a) ? 1 : a];
  }

  throw new Error('[__PACKAGE_NAME__]: This is not a valid color format');
}

function nameToHex(color: string): string {
  const normalizedColorName = color.toLowerCase().trim();
  const rgb = colorNames[normalizedColorName as keyof typeof colorNames];

  if (!rgb) {
    throw new Error(
      `[__PACKAGE_NAME__]: This is not a valid color name: ${color}`
    );
  }

  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`;
}

function hslToRgb(
  hue: number,
  saturation: number,
  lightness: number
): Array<number> {
  const l = lightness / 100;
  const s = saturation / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray];
  }

  const huePrime = (((hue % 360) + 360) % 360) / 60;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let [r, g, b] = [0, 0, 0];

  switch (Math.floor(huePrime)) {
    case 0:
      [r, g, b] = [chroma, x, 0];
      break;
    case 1:
      [r, g, b] = [x, chroma, 0];
      break;
    case 2:
      [r, g, b] = [0, chroma, x];
      break;
    case 3:
      [r, g, b] = [0, x, chroma];
      break;
    case 4:
      [r, g, b] = [x, 0, chroma];
      break;
    case 5:
      [r, g, b] = [chroma, 0, x];
      break;
  }

  const m = l - chroma / 2;
  return [r + m, g + m, b + m].map((v) => Math.round(v * 255));
}

export default parseToRgba;
