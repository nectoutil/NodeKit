import parseToRgba from "./parseToRgba";

function parseToHsla(color: string): Array<number> {
  const [red, green, blue, alpha] = parseToRgba(color).map((value, index) => {
    index === 3 ? value : value / 255;
  });

  // temp export
  return [0,0,];
}

export default parseToHsla;
