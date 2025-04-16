import { describe, it, expect } from 'vitest';
import { namePathToDotNotation } from '../../src/transformers/namePathToDotNotation';

import type { PlatformConfig, TransformedToken } from 'style-dictionary/types';

function createTestToken(
  path: string[],
  prefix?: string
): { token: TransformedToken; options: PlatformConfig } {
  return {
    token: {
      path
    } as unknown as TransformedToken,
    options: {
      prefix
    } as PlatformConfig
  }
}

describe('Transform: namePathToDotNotation', () => {
  it('transforms token path plus prefix into dot notation', () => {
    const { token, options } = createTestToken(['base', 'color', 'red', '500'], 'my-prefix')
    const transformedName = namePathToDotNotation.transform(token, options)
    // "my-prefix.base.color.red.500" becomes "myPrefix.base.color.red.500" with camelCase
    expect(transformedName).toBe('myPrefix.base.color.red.500')
  })

  it('transforms token path without prefix into dot notation', () => {
    const { token, options } = createTestToken(['base', 'space', 'xs'])
    const transformedName = namePathToDotNotation.transform(token, options)
    // "base.space.xs" => "base.space.xs"
    expect(transformedName).toBe('base.space.xs')
  })

  it('filters out "@" parts in path', () => {
    const { token, options } = createTestToken(['@', 'base', 'warning', 'text'])
    const transformedName = namePathToDotNotation.transform(token, options)
    // Ignores "@" => "base.warning.text"
    expect(transformedName).toBe('base.warning.text')
  })
})
