import colorNames from "color-name";
import parseToRgba from "../parsers/parseToRgba";

function toColorString(color: string): { model: string, value: Array<number> } {
  switch(color.slice(0, 3).toLowerCase()) {
    default: {
      return {
        model: "",
        value: parseToRgba(color)
      }
    }
  }
}
