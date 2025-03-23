import { describe, it, expect } from 'vitest'
import { colorAlphaToCss } from "../../src/transformers/colorAlphaToCss"

function getMockToken({ $value, alpha }) {
  return {
    $value,
    alpha
  }
}

describe('Transformer: colorAlphaToCss', () => {
  it('transforms hex3, hex6, hex8 `color` tokens without alpha value', () => {
    const input = [
      getMockToken({ $value: '#abc' }),
      getMockToken({ $value: '#abcdef' }),
      getMockToken({ $value: '#abcdef55' }),
    ]
    const expectedOutput = ['#abc', '#abcdef', '#abcdef55']
    expect(input.map(item => colorAlphaToCss.transform(item, {}, {}))).toStrictEqual(expectedOutput)
  })

  it('transforms hex3, hex6, hex8 `color` tokens with alpha value', () => {
    const input = [
      getMockToken({ $value: '#abc', alpha: 0.2 }),
      getMockToken({ $value: '#abcdef', alpha: 0.5 }),
      getMockToken({ $value: '#abcdef66', alpha: 0.8 }),
    ]
    // alpha of 0.2 => transparent 80%
    // alpha of 0.5 => transparent 50%
    // alpha of 0.8 => transparent 20%
    const expectedOutput = [
      'color-mix(in srgb, #abc, transparent 80%)',
      'color-mix(in srgb, #abcdef, transparent 50%)',
      'color-mix(in srgb, #abcdef66, transparent 20%)',
    ]
    expect(input.map(item => colorAlphaToCss.transform(item, {}, {}))).toStrictEqual(expectedOutput)
  })

  it('transforms references with and without alpha value', () => {
    const input = [
      getMockToken({ $value: '{base.color.blue.5}' }),
      getMockToken({ $value: '{base.color.orange.3}', alpha: 0.3 }),
    ]
    // The second token uses an alpha of 0.3 => transparent 70%
    const expectedOutput = [
      '{base.color.blue.5}',
      'color-mix(in srgb, {base.color.orange.3}, transparent 70%)',
    ]
    expect(
      input.map(item => colorAlphaToCss.transform(item, {}, {}))
    ).toStrictEqual(expectedOutput)
  })

  it('transforms color-mix with and without alpha value', () => {
    const input = [
      getMockToken({ $value: 'color-mix(in srgb, {base.color.yellow.2}, transparent 25%)' }),
      getMockToken({ $value: 'color-mix(in srgb, {base.color.yellow.2}, transparent 25%)', alpha: 0.4 }),
    ]
    // When alpha is 0.4 => transparent 60%
    const expectedOutput = [
      'color-mix(in srgb, {base.color.yellow.2}, transparent 25%)',
      'color-mix(in srgb, color-mix(in srgb, {base.color.yellow.2}, transparent 25%), transparent 60%)',
    ]
    expect(
      input.map(item => colorAlphaToCss.transform(item, {}, {}))
    ).toStrictEqual(expectedOutput)
  })
})
