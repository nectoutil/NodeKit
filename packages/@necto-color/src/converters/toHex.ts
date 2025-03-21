import parseToRgba from "../parsers/parseToRgba";

function toHex(color: string): string {
  const [r, g, b, a] = parseToRgba(color);

  const hex = (x: number): string => {
    const hexValue = Math.min(Math.max(0, x), 255).toString(16);
    return hexValue.length === 1 ? `0${hexValue}` : hexValue;
  };

  const redHex = hex(r);
  const greenHex = hex(g);
  const blueHex = hex(b);
  let alphaHex = '';

  if (a < 1) {
    const alphaValue = Math.round(a * 255);
    alphaHex = hex(alphaValue);
  }

  return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
}

export default toHex;
