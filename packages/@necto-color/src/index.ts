import toHex from "./converters/toHex";
import toHexa from "./converters/toHexa";
import toRgba from "./converters/toRgba";
import toRgbaArray from "./converters/toRgbaArray";
import toColorString from "./converters/toColorString";

enum ColorModel {
  HEX = 'hex',
  HEXA = 'hexa',
  RGB = 'rgb',
  RGBA = 'rgba',
  HSL = 'hsl',
  CMYK = 'cmyk',
  STRING = 'string'
}

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

      this.value = object;
      this.model = model || ColorModel.STRING;
    } else {
      this.value = object;
      this.model = model || ColorModel.STRING;
    }
  }

  toHex(value: string): string {
    return toHex(value || this.value);
  }

  toHexa(value: string): string {
    return toHexa(value || this.value);
  }

  toRgba(value: string): string {
    return toRgba(value || this.value);
  }

  toRgbaArray(value: string): number[] {
    return toRgbaArray(value || this.value);
  }

  get hex(): string {
    return this.toHex(this.value);
  }

  get hexa(): string {
    return this.toHexa(this.value);
  }

  get rgba(): string {
    return this.toRgba(this.value);
  }

  get rgbaArray(): number[] {
    return this.toRgbaArray(this.value);
  }

  static hex(hexString: string): Color {
    return new Color(hexString, ColorModel.HEX);
  }

  static hexa(hexaString: string): Color {
    return new Color(hexaString, ColorModel.HEXA);
  }

  static rgba(rgbaString: string): Color {
    return new Color(rgbaString, ColorModel.RGBA);
  }
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
  toHexa,
  toRgba,
  toRgbaArray,
  toColorString
};

export default ColorProxy;
