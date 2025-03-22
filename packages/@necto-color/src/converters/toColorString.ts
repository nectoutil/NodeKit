import parseToHsla from "../parsers/parseToHsla";
import parseToRgba from "../parsers/parseToRgba";

function toColorString(color: string): { model: string, value: Array<number> } {
  switch(color.slice(0, 3).toLowerCase()) {
    case 'hsl': {
      return {
        model: 'hsl',
        value: parseToHsla(color)
      }

    }

    default: {
      return {
        model: "rgb",
        value: parseToRgba(color)
      }
    }
  }
}

export default toColorString;
