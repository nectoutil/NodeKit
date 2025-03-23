import { describe, it, expect } from 'vitest';
import { colorToHex } from '../../src/transformers/colorToHex';
describe('colorToHex', () => {
  const mockToken = {
    alpha: 1,
    value: '#ff0000',
  };

  const mockConfig = {};

  it('should convert color to hex without alpha', () => {
    const result = colorToHex.transform(mockToken, mockConfig);
    expect(result).toBe('#ff0000');
  });

  it('should convert color to hex with alpha', () => {
    const tokenWithAlpha = { ...mockToken, alpha: 0.5 };
    const result = colorToHex.transform(tokenWithAlpha, mockConfig);
    expect(result).toBe('#ff000080');
  });

  it('should handle undefined alpha value', () => {
    const tokenWithUndefinedAlpha = { ...mockToken, alpha: undefined };
    const result = colorToHex.transform(tokenWithUndefinedAlpha, mockConfig);
    expect(result).toBe('#ff0000');
  });

  it('should handle null alpha value', () => {
    const tokenWithNullAlpha = { ...mockToken, alpha: null };
    const result = colorToHex.transform(tokenWithNullAlpha, mockConfig);
    expect(result).toBe('#ff0000');
  });
});