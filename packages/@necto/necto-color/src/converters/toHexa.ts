import parseToRgba from "../parsers/parseToRgba";

function toHexa(color: string): string {
  const [r, g, b, a] = parseToRgba(color);

  const hex = (x: number): string => {
    const hexValue = Math.min(Math.max(0, x), 255).toString(16).padStart(2, '0');
    return hexValue;
  };

  const redHex = hex(r);
  const greenHex = hex(g);
  const blueHex = hex(b);
  const alphaHex = hex(Math.round(a * 255));

  return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
}

export default toHexa;
