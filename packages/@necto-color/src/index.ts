import toHex from "./converters/toHex";
import { ColorModel } from "./types";

/**
 * @info Color class exports based on Quix-'s Color
 * npm package. This uses preterite converters and parsers export individually.
 */
class Color {
  private value: string;
  private model: ColorModel;

  constructor(object: any, model?: ColorModel) {
    if (!(this instanceof Color)) {
      return new Color(object, model);
    }

    if (typeof object === 'string') {
      if (!model) {
        const parsed = colorString.get(object);

        if (parsed) {
          model = parsed.model as ColorModel;
        } else {
          model = ColorModel.STRING;
        }
      }

      switch (model) {
        case ColorModel.HEX:
          return Color.hex(object);
        default:
          this.value = object;
          this.model = (model || ColorModel.STRING);
          return this;
      }
    }

    this.value = object;
    this.model = (model || ColorModel.STRING);
    return this;
  }

  /**
   * Static Hex constructor (static method) - named 'hex'
   */
  static hex(hexString: string): Color {
    return new Color(hexString, ColorModel.HEX);
  }

  /**
   * Hex conversion utility (instance method) - named 'hex' now
   */
  toHex(): string {
    return toHex(this.value);
  }
}

export {
  toHex
};

export default Color;
