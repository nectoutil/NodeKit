import convert from 'color-convert';
import colorString from 'color-string';
import toHex from "./converters/toHex";
import toHexa from "./converters/toHexa";
import toRgba from "./converters/toRgba";
import toRgbaArray from "./converters/toRgbaArray";

class Color {
  // Allow dynamic access if needed.
  static [key: string]: any;
  static [key: symbol]: any;

  private value!: string;
  private valpha!: number;
  private color!: number[];
  private model!: string;

  constructor(object: any, model?: string) {
    // Allow calling without "new"
    if (!(this instanceof Color)) {
      return new Color(object, model);
    }

    if (object == null) {
      this.model = 'rgb';
      this.color = [0, 0, 0];
      this.valpha = 1;
      this.value = 'rgb(0, 0, 0)';
    } else if (object instanceof Color) {
      this.model = object.model;
      this.valpha = object.valpha;
      this.color = [...object.color];
      this.value = object.value;
    } else if (typeof object === 'string') {
      const parsed = colorString.get(object);
      if (parsed === null) {
        throw new Error(`[__PACKAGE_NAME__]: Unable to parse color from string: ${object}`);
      }

      this.value = object;
      let detectedModel: string;
      if (object.trim().startsWith('#')) {
        const len = object.trim().length;
        if (len === 5 || len === 9) {
          detectedModel = 'hexa';
        } else {
          detectedModel = 'hex';
        }
      } else {
        detectedModel = parsed.model;
      }

      // Special rule: if a model is forced via static method then validate.
      // For an rgba request, allow a parsed "rgb" if the parsed value includes an alpha channel.
      if (model) {
        if (
          !(model === 'rgba' &&
            detectedModel === 'rgb' &&
            parsed.value.length === 4)
        ) {
          if (model !== detectedModel) {
            throw new Error(
              `[__PACKAGE_NAME__]: Input color model (${detectedModel}) does not match the specified model (${model}).`
            );
          }
        }
      }

      this.model = model || detectedModel;

      const convModel = detectedModel === 'hexa' ? 'hex' : detectedModel;
      const conv = (convert as any)[convModel];
      const channels: number | undefined = conv && conv.channels;
      if (!channels) {
        throw new Error(`[__PACKAGE_NAME__]: Conversion for model ${detectedModel} is not supported.`);
      }

      this.color = parsed.value.slice(0, channels);
      this.valpha =
        detectedModel === 'hex'
          ? 1
          : (detectedModel === 'hexa'
              ? // For hexa inputs, force alpha to 1 if it isn't provided by color-string.
                (typeof parsed.value[channels] === 'number' ? parsed.value[channels] : 1)
              : (typeof parsed.value[channels] === 'number' ? parsed.value[channels] : 1));

      // Internally, always store the color in RGB.
      if (convModel !== 'rgb') {
        const convertToRgb = conv && conv.rgb;
        if (typeof convertToRgb === 'function') {
          this.color = convertToRgb(this.color);
        } else {
          throw new Error(
            `[__PACKAGE_NAME__]: Conversion from ${detectedModel} to RGB is not supported.`
          );
        }
      }
    } else if (Array.isArray(object)) {
      this.model = model || 'rgb';
      this.color = object.slice(0, 3);
      this.valpha = typeof object[3] === 'number' ? object[3] : 1;
      this.value = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.valpha})`;
    } else {
      throw new Error(`[__PACKAGE_NAME__]: Unsupported color input type.`);
    }
  }

  toHex(value?: string): string {
    return toHex(value || this.value);
  }

  toHexa(value?: string): string {
    return toHexa(value || this.value);
  }

  toRgba(value?: string): string {
    return toRgba(value || this.value);
  }

  toRgbaArray(value?: string): number[] {
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

// Factory function and proxy to allow calling without `new`
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

export { toHex, toHexa, toRgba, toRgbaArray };
export default ColorProxy;
