import { describe, it, expect } from 'vitest';

import Color from '../src/index';

describe('Color class', () => {
  it('should create an instance using the new keyword', () => {
    const color = new Color('#fff');
    expect(color).toBeInstanceOf(Color);
    expect(color.toHex()).toBe('#ffffff');
  });

  it('should create an instance without using the new keyword', () => {
    const color = Color('#fff');
    expect(color).toBeInstanceOf(Color);
    expect(color.toHex()).toBe('#ffffff');
  });

  it('should create an instance using the static hex method', () => {
    const color = Color.hex('#fff');
    expect(color).toBeInstanceOf(Color);
    expect(color.toHex()).toBe('#ffffff');
  });

  it('should parse a color string correctly', () => {
    const color = new Color('rgb(255, 255, 255)');
    expect(color).toBeInstanceOf(Color);
    expect(color.toHex()).toBe('#ffffff');
  });

  it('should handle different color formats', () => {
    const hexColor = new Color('#fff');
    expect(hexColor.toHex()).toBe('#ffffff');

    const rgbaColor = new Color('rgba(255, 255, 255, 1)');
    expect(rgbaColor.toRgba()).toBe('rgba(255, 255, 255, 1)');
  });

  it('should convert to HEXA correctly', () => {
    const color = new Color('rgba(255, 255, 255, 0.5)');
    expect(color.toHexa()).toBe('#ffffff80');
  });

  it('should return correct RGBA array', () => {
    const color = new Color('rgba(255, 255, 255, 0.5)');
    expect(color.toRgbaArray()).toEqual([255, 255, 255, 0.5]);
  });

  it('should handle string conversion correctly', () => {
    const color = new Color('#ffffff');
    expect(color.toHex()).toBe('#ffffff');
    expect(color.toHexa()).toBe('#ffffffff');
    expect(color.toRgba()).toBe('rgba(255, 255, 255, 1)');
    expect(color.toRgbaArray()).toEqual([255, 255, 255, 1]);
  });
});
