import { describe, it, expect } from 'vitest';

import parseToRgba from '../../src/parsers/parseToRgba';

describe('parseToRgba', () => {
  it('works for all named colors', () => {
    const namedColorMap = {
      coral: 'ff7f50',
      darkorchid: '9932cc',
      darksalmon: 'e9967a',
      deeppink: 'ff1493',
      dodgerblue: '1e90ff',
      firebrick: 'b22222',
      forestgreen: '228b22',
      fuchsia: 'ff00ff',
      gold: 'ffd700',
      goldenrod: 'daa520',
      gray: '808080',
      green: '008000',
      honeydew: 'f0fff0',
      hotpink: 'ff69b4',
      indianred: 'cd5c5c',
      indigo: '4b0082',
      ivory: 'fffff0',
      khaki: 'f0e68c',
      lavender: 'e6e6fa',
      lawngreen: '7cfc00',
      lemonchiffon: 'fffacd',
      lightblue: 'add8e6',
      lightcoral: 'f08080',
      lightcyan: 'e0ffff',
      lightgoldenrodyellow: 'fafad2',
      lightgray: 'd3d3d3',
      lightgreen: '90ee90',
      lightpink: 'ffb6c1',
      lightsalmon: 'ffa07a',
      lime: '00ff00',
      limegreen: '32cd32',
      linen: 'faf0e6',
      magenta: 'ff00ff',
      maroon: '800000',
      mediumaquamarine: '66cdaa',
      mediumblue: '0000cd',
      mediumorchid: 'ba55d3',
      mediumpurple: '9370db',
      mediumseagreen: '3cb371',
    };

    for (const [color, value] of Object.entries(namedColorMap)) {
      expect(parseToRgba(color)).toEqual(parseToRgba(`#${value}`));
    }
  });

  it('should parse a hex color representation', () => {
    expect(parseToRgba('#Ff43AE')).toMatchInlineSnapshot(`
      [
        255,
        67,
        174,
        1,
      ]
    `);
  });

  it('should parse a reduced hex color representation', () => {
    expect(parseToRgba('#fff')).toMatchInlineSnapshot(`
      [
        255,
        255,
        255,
        1,
      ]
    `);
  });

  it('should parse an 8-digit hex color representation', () => {
    expect(parseToRgba('#Ff43AEFF')).toMatchInlineSnapshot(`
      [
        255,
        67,
        174,
        1,
      ]
    `);
  });

  it('should parse a 4-digit hex color representation', () => {
    expect(parseToRgba('#0f08')).toMatchInlineSnapshot(`
      [
        0,
        255,
        0,
        0.5333333333333333,
      ]
    `);
  });

  it('should parse an rgba color representation', () => {
    expect(parseToRgba('rgba(174,67,255,0.6)')).toMatchInlineSnapshot(`
      [
        174,
        67,
        255,
        0.6,
      ]
    `);
    expect(parseToRgba('rgba( 174 , 67 , 255 , 0.6 )')).toMatchInlineSnapshot(`
      [
        174,
        67,
        255,
        0.6,
      ]
    `);
  });

  it('should parse an rgb color representation', () => {
    expect(parseToRgba('rgb(174,67,255)')).toMatchInlineSnapshot(`
      [
        174,
        67,
        255,
        1,
      ]
    `);
    expect(parseToRgba('rgb( 174 , 67 , 255 )')).toMatchInlineSnapshot(`
      [
        174,
        67,
        255,
        1,
      ]
    `);
  });

  it('should parse an hsl color representation', () => {
    expect(parseToRgba('hsl(210,10%,4%)')).toMatchInlineSnapshot(`
      [
        9,
        10,
        11,
        1,
      ]
    `);
    expect(parseToRgba('hsl( 210 , 10% , 4% )')).toMatchInlineSnapshot(`
      [
        9,
        10,
        11,
        1,
      ]
    `);
  });

  it('should parse an hsl color representation with decimal values', () => {
    expect(parseToRgba('hsl(210,16.4%,13.2%)')).toMatchInlineSnapshot(`
      [
        28,
        34,
        39,
        1,
      ]
    `);
    expect(parseToRgba('hsl( 210 , 16.4%, 13.2% )')).toMatchInlineSnapshot(`
      [
        28,
        34,
        39,
        1,
      ]
    `);
  });

  it('should parse an hsla color representation', () => {
    expect(parseToRgba('hsla(210,10%,40%,0.75)')).toMatchInlineSnapshot(`
      [
        92,
        102,
        112,
        0.75,
      ]
    `);
    expect(parseToRgba('hsla( 210 , 10% , 40% , 0.75 )')).toMatchInlineSnapshot(`
      [
        92,
        102,
        112,
        0.75,
      ]
    `);
  });

  it('should parse an hsla color representation with decimal values', () => {
    expect(parseToRgba('hsla(210,0.5%,0.5%,1.0)')).toMatchInlineSnapshot(`
      [
        1,
        1,
        1,
        1,
      ]
    `);
    expect(parseToRgba('hsla( 210 , 0.5% , 0.5% , 1.0 )')).toMatchInlineSnapshot(`
      [
        1,
        1,
        1,
        1,
      ]
    `);
  });

  it('parses should parse an hsla color with an alpha value of zero', () => {
    expect(parseToRgba('hsla(210,0.5%,0.5%,0)')).toMatchInlineSnapshot(`
      [
        1,
        1,
        1,
        0,
      ]
    `);
    expect(parseToRgba('hsla( 210 , 0.5% , 0.5% , 0.01 )')).toMatchInlineSnapshot(`
      [
        1,
        1,
        1,
        0.01,
      ]
    `);
  });

  it('throws an error if an invalid color string is provided', () => {
    expect(() => {
      parseToRgba('(174,67,255)');
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: [__PACKAGE_NAME__]: This is not a valid color format]`
    );
  });

  it('throws an error if an invalid color string is provided', () => {
    expect(() => {
      // @ts-ignore
      parseToRgba(12345);
    }).toThrowErrorMatchingInlineSnapshot(`[Error: [__PACKAGE_NAME__]: This is not a valid color]`);
  });

  it('throws an error if an invalid hsl string is provided', () => {
    expect(() => {
      parseToRgba('hsl(210,120%,4%)');
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: [__PACKAGE_NAME__]: Invalid saturation value: 120]`
    );

    expect(() => {
      parseToRgba('hsla(210,100%,400%,0.7)');
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: [__PACKAGE_NAME__]: Invalid lightness value: 400]`
    );
  });

  it('throws an error if an invalid named color is provided', () => {
    expect(() => {
      parseToRgba('notrealblue');
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: [__PACKAGE_NAME__]: This is not a valid color name: notrealblue]`
    );
  });
});
