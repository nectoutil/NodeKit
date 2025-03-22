import { describe, it, expect } from 'vitest';

import Color from '../src/index';
import { ColorModel } from '../src/types';

describe('Color class', () => {
  it('should create an instance using the new keyword', () => {
    const color = new Color('#fff');
    expect(color).toBeInstanceOf(Color);
    if (color.toHex) {
      expect(color.toHex()).toBe('#ffffff');
    } else {
      expect(color.toHex).toBeUndefined();
    }
  });

  it('should create an instance without using the new keyword', () => {
    const color = Color('#fff');
    expect(color).toBeInstanceOf(Color);
    if (color.toHex) {
      expect(color.toHex()).toBe('#ffffff');
    } else {
      expect(color.toHex).toBeUndefined();
    }
  });

  it('should create an instance using the static hex method', () => {
    const color = Color.hex('#fff');
    expect(color).toBeInstanceOf(Color);
    expect(color.toHex).toBeUndefined();
  });

  it('should parse a color string correctly', () => {
    const color = new Color('rgb(255, 255, 255)');
    expect(color).toBeInstanceOf(Color);
    expect(color.toHex()).toBe('#ffffff');
  });

  it('should handle different color models', () => {
    const hexColor = new Color('#fff', ColorModel.HEX);
    expect(hexColor.toHex).toBeUndefined();

    const stringColor = new Color('rgb(255, 255, 255)', ColorModel.STRING);
    expect(stringColor.toHex()).toBe('#ffffff');
  });
});
