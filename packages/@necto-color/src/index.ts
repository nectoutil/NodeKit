import { ColorModel } from "./types";
import toHex from "./converters/toHex";
import toRgba from "./converters/toRgba";
import toColorString from "./converters/toColorString";

/**
 * @info Color class exports based on Quix-'s Color
 * npm package. This uses preterite converters and parsers export individually.
 */
class Color {
  static [key: string]: any;
  static [key: symbol]: any;

  private value!: string;
  private model!: ColorModel;

  constructor(object: any, model?: ColorModel) {
    if (!(this instanceof Color)) {
      return new Color(object, model);
    }

    if (typeof object === 'string') {
      if (!model) {
        const parsed = toColorString(object);

        if (parsed) {
          model = parsed.model as ColorModel;
        } else {
          model = ColorModel.STRING;
        }
      }

      switch (model) {
        case ColorModel.HEX: {
          this.value = object;
          this.model = ColorModel.HEX;
          this.toRgba = () => toRgba(this.value);
          break;
        }

        default: {
          this.value = object;
          this.model = model || ColorModel.STRING;
          this.toHex = () => toHex(this.value);
          break;
        }
      }
    } else {
      this.value = object;
      this.model = model || ColorModel.STRING;
      this.toHex = function() {
        return toHex(this.value);
      };
    }
  }

  /**
   * Static Hex constructor (static method) - named 'hex'
   */
  static hex(hexString: string): Color {
    return new Color(hexString, ColorModel.HEX);
  }

  /**
   * Static RGBA constructor (static method) - named 'hex'
   */
  static rgba(rgbaString: string): Color {
    return new Color(rgbaString, ColorModel.STRING);
  }

  /**
   * Hex conversion utility (instance method) - named 'hex' now
   */
  toHex?(): string;

   /**
   * Hex conversion utility (instance method) - named 'hex' now
   */
   toRgba?(): string;
}

function ColorFactory(object: any, model?: ColorModel): Color {
  return new Color(object, model);
}

/**
 * Create a proxy to allow calling of Color class without using new
 * for syntactical reasons.
 */
const ColorProxy = new Proxy(Color, {
  apply(target, thisArg, argumentsList: [any, ColorModel?]) {
    return ColorFactory(...argumentsList);
  },

  get(target, prop, receiver) {
    if (prop in target) {
      return target[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

export {
  toHex,
  toColorString
};

export default ColorProxy;
