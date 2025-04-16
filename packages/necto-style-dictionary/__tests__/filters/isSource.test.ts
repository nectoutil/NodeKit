import { describe, it, expect } from 'vitest';
import { TransformedToken } from 'style-dictionary/types';
import { isSource } from '../../src/filters/isSource';

describe('Filter: isSource', () => {
  const items = [
    {
      value: 'red is source',
      isSource: true,
    },
    {
      value: 'blue is not source',
      isSource: false,
    },
    {
      value: 'yellow is not source',
    },
  ] as TransformedToken[]
  it('filters out non-source items', () => {
    expect(items.filter(isSource)).toStrictEqual([items[0]])
  })
})