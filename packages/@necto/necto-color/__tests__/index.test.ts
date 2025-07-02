import { describe, it, expect } from 'vitest';
import Color from '../src/index';

describe('Color class', () => {
  it('should create a Color instance from rgba string', () => {
    const myColor = Color.rgba('rgba(10,10,10,1)');
    expect(myColor.rgba).toBe('rgba(10, 10, 10, 1)');
  });

  it('should convert rgba to hex', () => {
    const myColor = Color.rgba('rgba(10,10,10,1)');
    expect(myColor.hex).toBe('#0a0a0a');
  });

  it('should convert rgba to hexa', () => {
    const myColor = Color.rgba('rgba(10,10,10,1)');
    expect(myColor.hexa).toBe('#0a0a0aff');
  });

  it('should convert rgba to rgba array', () => {
    const myColor = Color.rgba('rgba(10,10,10,1)');
    expect(myColor.rgbaArray).toEqual([10, 10, 10, 1]);
  });

  it('should change alpha value', () => {
    const myColor = Color.rgba('rgba(10,10,10,1)');
    const newColor = myColor.alpha(0.5);
    expect(newColor.rgba).toBe('rgba(10, 10, 10, 0.5)');
  });

  it('should create a Color instance from hex string', () => {
    const myColor = Color.hex('#0a0a0a');
    expect(myColor.hex).toBe('#0a0a0a');
  });

  it('should create a Color instance from hexa string', () => {
    const myColor = Color.hexa('#0a0a0aff');
    expect(myColor.hexa).toBe('#0a0a0aff');
  });

  it('should convert hex to rgba', () => {
    const myColor = Color.hex('#0a0a0a');
    expect(myColor.rgba).toBe('rgba(10, 10, 10, 1)');
  });

  it('should convert hexa to rgba', () => {
    const myColor = Color.hexa('#0a0a0aff');
    expect(myColor.rgba).toBe('rgba(10, 10, 10, 1)');
  });

  it('should handle alpha value correctly when converting to hex', () => {
    const myColor = Color.rgba('rgba(10, 10, 10, 0.5)');
    expect(myColor.hexa).toBe('#0a0a0a80');
  });

  it('should handle array input correctly', () => {
    const myColor = new Color([10, 10, 10, 0.5]);
    expect(myColor.rgba).toBe('rgba(10, 10, 10, 0.5)');
  });

  it('should throw an error for unsupported color input type', () => {
    expect(() => new Color({})).toThrow(
      '[__PACKAGE_NAME__]: Unsupported color input type.'
    );
  });

  it('model should not change based on alpha hex', () => {
    const myColor = new Color('#fff').alpha(0.3);
    expect(myColor.model).toBe('hex');
  });
});
