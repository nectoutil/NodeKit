import { describe, it, expect } from 'vitest';
import { TransformedToken } from 'style-dictionary/types';
import { dimensionToRem } from "../../src/transformers/dimensionToRem";

describe('transform: dimensionPixelToRem', () => {
  const items = [
    {
      value: '20px',
      $type: 'dimension',
    },
    {
      $value: '30px',
      $type: 'dimension',
    },
    {
      value: '3rem',
      $type: 'dimension',
    },
    {
      value: '',
      $type: 'color',
    },
    {
      value: '',
    },
  ] as TransformedToken[]

  it('matches `dimension` tokens with pixel value', () => {
    expect(items.filter(dimensionToRem.filter)).toStrictEqual([items[0], items[1]])
  })

  it('transforms `dimension` tokens', () => {
    expect(
      items.filter(dimensionToRem.filter).map(item => dimensionToRem.transform(item, {}, {})),
    ).toStrictEqual(['1.25rem', '1.875rem'])
  })

  it('transforms `dimension` tokens with custom baseFont', () => {
    const platform = {
      basePxFontSize: 10,
    }
    expect(
      items.filter(dimensionToRem.filter).map(item => dimensionToRem.transform(item, platform, {})),
    ).toStrictEqual(['2rem', '3rem'])
  })
})