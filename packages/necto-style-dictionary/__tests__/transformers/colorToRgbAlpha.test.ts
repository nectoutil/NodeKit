import { describe, it, expect } from 'vitest';
import { TransformedToken } from 'style-dictionary/types';
import { colorToRgbAlpha } from '../../src/transformers/colorToRgbAlpha';

describe('transform: colorToRgba', () => {
  it('transforms `color` tokens with hex value', () => {
    expect(
      [{value: '#343'}, {$value: '#343434'}, {value: '#34343466'}].map(item =>
        colorToRgbAlpha.transform(item as TransformedToken, {}, {}),
      ),
    ).toStrictEqual(['rgba(51, 68, 51, 1)', 'rgba(52, 52, 52, 1)', 'rgba(52, 52, 52, 0.4)'])
  })

  it('transforms `color` tokens with rgb value and keeps alpha values', () => {
    expect(
      [{value: 'rgb(100,200,255)'}, {$value: 'rgba(100,200,255, .4)'}, {value: 'rgba(100,200,255, 0)'}].map(item =>
        colorToRgbAlpha.transform(item as TransformedToken, {}, {}),
      ),
    ).toStrictEqual(['rgba(100, 200, 255, 1)', 'rgba(100, 200, 255, 0.4)', 'rgba(100, 200, 255, 0)'])
  })

  it('transforms `color` tokens with alpha', () => {
    expect(
      [
        {value: '#343434', alpha: 0.4},
        {$value: '#343434cc', alpha: 0.2},
        {value: '#343434', alpha: 0},
        // @ts-expect-error: fake token for test causes error
      ].map(item => colorToRgbAlpha.transform(item, {}, {})),
    ).toStrictEqual(['rgba(52, 52, 52, 0.4)', 'rgba(52, 52, 52, 0.2)', 'rgba(52, 52, 52, 0)'])
  })
})