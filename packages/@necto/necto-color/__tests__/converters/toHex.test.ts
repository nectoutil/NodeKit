import { describe, it, expect } from 'vitest';

import toHex from '../../src/converters/toHex';

describe('Color Conversion Tests', () => {
  it('takes in any color and returns its hex code', () => {
    expect(toHex('red')).toMatchInlineSnapshot(`"#ff0000"`);
  });

  it('hex with transparency', () => {
    expect(toHex('#0000ff55')).toMatchInlineSnapshot(`"#0000ff55"`);
  });

  it('rgba no transparency', () => {
    expect(toHex('rgb(0, 175, 0)')).toMatchInlineSnapshot(`"#00af00"`);
  });

  it('hsla with transparency', () => {
    expect(toHex('rgba(0, 255, 0, 0.5)')).toMatchInlineSnapshot(`"#00ff0080"`);
  });

  it('https://github.com/ricokahler/color2k/issues/463', () => {
    expect(toHex('hsla(15, 50%, 50%, 0)')).toMatchInlineSnapshot(`"#bf604000"`);
  });
});
