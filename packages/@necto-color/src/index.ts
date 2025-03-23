import convert from 'color-convert';
import colorString from 'color-string';
import toHex from "./converters/toHex";
import toHexa from "./converters/toHexa";
import toRgba from "./converters/toRgba";
import toRgbaArray from "./converters/toRgbaArray";

// This is a horrible and very shit color conversion library.
//  DO NOT USE, it is build as a temp solution, it will be fixed later!
class Color {
  static [key: string]: any;
  static [key: symbol]: any;

  private value!: string;
  private valpha!: number;
  private color!: number[];
  private model!: string;

  constructor(object: any, model?: string) {
    if (!(this instanceof Color)) {
      return new Color(object, model);
    }

    if (object == null) {
      this.model = "rgb";
      this.color = [0, 0, 0];
      this.valpha = 1;
      this.value = "rgb(0, 0, 0)";
    } else if (object instanceof Color) {
      this.model = object.model;
      this.valpha = object.valpha;
      this.color = [...object.color];
      this.value = object.value;
    } else if (typeof object === "string") {
      const parsed = colorString.get(object);
      if (parsed === null) {
        throw new Error(`[__PACKAGE_NAME__]: Unable to parse color from string: ${object}`);
      }

      // Preserve the original input value
      this.value = object;

      // color-string’s 'parsed.model' might be "rgb" or "hsl" (etc.),
      // and we want to see if there's an alpha channel
      let detectedModel = parsed.model;
      const numChannels = parsed.value.length;

      // If we see "rgb" but there are 4 channels, treat it as "rgba" internally
      // (But remember color-convert doesn’t have an 'rgba' section.)
      if (detectedModel === "rgb" && numChannels === 4) {
        detectedModel = "rgba" as any;
      }

      // If a specific model is provided, validate
      if (model && model !== detectedModel) {
        throw new Error(
          `[__PACKAGE_NAME__]: Input color model (${detectedModel}) does not match the specified model (${model}).`
        );
      }

      // Save our user-facing model, e.g. "rgba"
      this.model = model || detectedModel;

      // For color-convert lookups, revert "rgba" → "rgb"
      // (Likewise for "hsla" → "hsl", etc.)
      const colorConvertModel = detectedModel.replace("a", "");

      // Now get channel count from color-convert. E.g. "rgb" → 3 channels
      const channels = (convert as any)[colorConvertModel].channels;
      this.color = parsed.value.slice(0, channels);

      // If there's an alpha in parsed.value, store it. Otherwise default to 1.
      this.valpha =
        typeof parsed.value[channels] === "number" ? parsed.value[channels] : 1;

      // Convert to RGB for internal usage
      if (colorConvertModel !== "rgb") {
        const convertToRgb = (convert as any)[colorConvertModel]?.rgb;
        if (typeof convertToRgb === "function") {
          this.color = convertToRgb(this.color);
        } else {
          throw new Error(
            `[__PACKAGE_NAME__]: Conversion from ${detectedModel} to RGB is not supported.`
          );
        }
      }

    } else if (Array.isArray(object)) {
      this.model = model || "rgb";
      this.color = object.slice(0, 3);
      this.valpha = typeof object[3] === "number" ? object[3] : 1;
      this.value = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.valpha})`;
    } else {
      throw new Error(`[__PACKAGE_NAME__]: Unsupported color input type.`);
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

  alpha(value: number): Color | number {
    if (value !== undefined) {
      this.valpha = Math.max(0, Math.min(1, value));
      return new Color([...this.color, this.valpha], this.model);
    }
    return this.valpha;
  }

  array(): number[] {
    return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
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
    return new Color(hexString, 'hex');
  }

  static hexa(hexaString: string): Color {
    return new Color(hexaString, 'hexa');
  }

  static rgba(rgbaString: string): Color {
    return new Color(rgbaString, 'rgba');
  }
}

function ColorFactory(object: any, model?: string): Color {
  return new Color(object, model);
}

const ColorProxy = new Proxy(Color, {
  apply(target, thisArg, argumentsList: [any, string?]) {
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
  toRgbaArray
};

export default ColorProxy;
