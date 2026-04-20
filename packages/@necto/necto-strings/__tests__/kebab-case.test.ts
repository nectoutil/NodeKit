/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

import { kebabCase } from '../src/index';

describe('kebab-case', () => {
  describe('basic usage', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(kebabCase('camelCase')).toBe('camel-case');
    });

    it('should convert PascalCase to kebab-case', () => {
      expect(kebabCase('PascalCase')).toBe('pascal-case');
    });

    it('should handle consecutive uppercase letters', () => {
      expect(kebabCase('HTMLParser')).toBe('h-t-m-l-parser');
    });

    it('should return the same string if already lowercase', () => {
      expect(kebabCase('hello')).toBe('hello');
    });

    it('should return an empty string for empty input', () => {
      expect(kebabCase('')).toBe('');
    });

    it('should handle a single uppercase letter', () => {
      expect(kebabCase('A')).toBe('a');
    });

    it('should handle a string with multiple words', () => {
      expect(kebabCase('myVariableName')).toBe('my-variable-name');
    });
  });

  describe('keepLeadingDash option', () => {
    it('should strip leading dash by default', () => {
      expect(kebabCase('PascalCase')).toBe('pascal-case');
    });

    it('should keep leading dash when keepLeadingDash is true', () => {
      expect(kebabCase('PascalCase', true)).toBe('-pascal-case');
    });

    it('should not add leading dash if string starts lowercase', () => {
      expect(kebabCase('camelCase', true)).toBe('camel-case');
    });
  });

  describe('reverse', () => {
    it('should convert kebab-case back to camelCase', () => {
      expect(kebabCase.reverse('camel-case')).toBe('camelCase');
    });

    it('should convert multi-segment kebab to camelCase', () => {
      expect(kebabCase.reverse('my-variable-name')).toBe('myVariableName');
    });

    it('should return the same string if no dashes', () => {
      expect(kebabCase.reverse('hello')).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(kebabCase.reverse('')).toBe('');
    });
  });
});
