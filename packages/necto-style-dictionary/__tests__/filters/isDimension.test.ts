import { describe, it, expect } from 'vitest'
import { isDimension } from '../../src/filters/isDimension';

function getMockToken({
  $type,
  alpha
}: {
  $type?: unknown
  alpha?: unknown
}) {
  return {
    $type,
    alpha
  }
}

describe('Filter: isDimension', () => {
  it('returns true if $type property is `dimension`', () => {
    expect(
      isDimension(getMockToken({ $type: 'dimension' }))
    ).toStrictEqual(true)
  })

  it('returns false if $type property is not `dimension`', () => {
    expect(
      isDimension(getMockToken({ $type: 'pumpkin' }))
    ).toStrictEqual(false)
  })

  it('returns false if $type property is missing', () => {
    expect(
      isDimension(getMockToken({ alpha: 0.4 }))
    ).toStrictEqual(false)
  })

  it('returns false if $type property is falsy', () => {
    expect(
      isDimension(getMockToken({ $type: false }))
    ).toStrictEqual(false)

    expect(
      isDimension(getMockToken({ $type: undefined }))
    ).toStrictEqual(false)

    expect(
      isDimension(getMockToken({ $type: null }))
    ).toStrictEqual(false)
  })
})
