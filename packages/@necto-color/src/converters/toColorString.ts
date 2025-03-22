import parseToRgba from "../parsers/parseToRgba";

function toColorString(color: string): { model: string, value: Array<number> } {
  switch(color.slice(0, 3).toLowerCase()) {
    default: {
      return {
        model: "rgb",
        value: parseToRgba(color)
      }
    }
  }
}

export default toColorString;
