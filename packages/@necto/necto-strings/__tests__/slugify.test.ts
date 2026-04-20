/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

import { slugify } from '../src/index';

describe('slugify', () => {
  describe('basic usage', () => {
    it('should convert a simple string to a slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should return an empty string for empty input', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle a single word', () => {
      expect(slugify('Hello')).toBe('hello');
    });

    it('should collapse multiple spaces into one replacement', () => {
      expect(slugify('hello    world')).toBe('hello-world');
    });

    it('should handle mixed separators (spaces, dashes, underscores, tildes)', () => {
      expect(slugify('hello - world ~ foo_bar')).toBe('hello-world-foo-bar');
    });
  });

  describe('replacement option', () => {
    it('should use a custom replacement character', () => {
      expect(slugify('Hello World', { replacement: '_' })).toBe('hello_world');
    });

    it('should use an empty replacement', () => {
      expect(slugify('Hello World', { replacement: '' })).toBe('helloworld');
    });

    it('should collapse multiple consecutive replacement characters', () => {
      expect(slugify('hello---world', { replacement: '-' })).toBe('hello-world');
    });
  });

  describe('lower option', () => {
    it('should lowercase by default', () => {
      expect(slugify('HELLO WORLD')).toBe('hello-world');
    });

    it('should preserve case when lower is false', () => {
      expect(slugify('Hello World', { lower: false })).toBe('Hello-World');
    });
  });

  describe('trim option', () => {
    it('should trim leading and trailing replacement characters by default', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
    });

    it('should trim leading and trailing dashes from input', () => {
      expect(slugify('--hello world--')).toBe('hello-world');
    });

    it('should not trim when trim is false', () => {
      expect(slugify('--hello world--', { trim: false })).toBe('-hello-world-');
    });
  });

  describe('strict option', () => {
    it('should strip non-alphanumeric characters in strict mode', () => {
      expect(slugify('hello!@#world', { strict: true })).toBe('helloworld');
    });

    it('should keep replacement character in strict mode', () => {
      expect(slugify('hello! world!', { strict: true })).toBe('hello-world');
    });

    it('should not strip special characters when strict is false', () => {
      expect(slugify('hello!world', { strict: false })).toBe('hello!world');
    });
  });

  describe('remove option', () => {
    it('should remove characters matching the regex', () => {
      expect(slugify('hello*world', { remove: new RegExp('\\*', 'g') })).toBe('helloworld');
    });

    it('should remove multiple patterns', () => {
      expect(slugify('hello!@world', { remove: new RegExp('[!@]', 'g') })).toBe('helloworld');
    });
  });

  describe('transliteration', () => {
    it('should transliterate Latin diacritics', () => {
      expect(slugify('àáâãäå')).toBe('aaaaaa');
    });

    it('should transliterate uppercase Latin diacritics', () => {
      expect(slugify('ÀÁÂÃÄÅ', { lower: false })).toBe('AAAAAA');
    });

    it('should transliterate German characters', () => {
      expect(slugify('Ünïcödé')).toBe('unicode');
    });

    it('should transliterate Cyrillic', () => {
      expect(slugify('Привет мир')).toBe('privet-mir');
    });

    it('should transliterate Greek', () => {
      expect(slugify('Αλφάβητο')).toBe('alfabhto');
    });

    it('should transliterate AE ligature', () => {
      expect(slugify('Æther')).toBe('aether');
    });

    it('should transliterate extended Latin characters', () => {
      expect(slugify('Łódź', { lower: false })).toBe('Lodz');
    });
  });

  describe('locale option', () => {
    it('should use German locale overrides', () => {
      expect(slugify('Ä Ö Ü', { locale: 'de' })).toBe('ae-oe-ue');
    });

    it('should use Turkish locale overrides', () => {
      expect(slugify('Şeker', { locale: 'tr' })).toBe('seker');
    });

    it('should use Swedish locale overrides', () => {
      expect(slugify('Ä Ö', { locale: 'sv' })).toBe('ae-oe');
    });

    it('should use Danish locale overrides', () => {
      expect(slugify('Ø Å', { locale: 'da' })).toBe('oe-aa');
    });

    it('should fall back to default charmap for non-overridden chars', () => {
      expect(slugify('Äpfél', { locale: 'de' })).toBe('aepfel');
    });
  });

  describe('currency symbols', () => {
    it('should transliterate dollar sign', () => {
      expect(slugify('$100', { strict: true })).toBe('dollar100');
    });

    it('should transliterate euro sign', () => {
      expect(slugify('€50', { strict: true })).toBe('euro50');
    });

    it('should transliterate pound sign', () => {
      expect(slugify('£20', { strict: true })).toBe('pound20');
    });
  });

  describe('special symbols', () => {
    it('should transliterate ampersand', () => {
      expect(slugify('foo & bar')).toBe('foo-and-bar');
    });

    it('should transliterate copyright symbol', () => {
      expect(slugify('©2024', { strict: true })).toBe('c2024');
    });

    it('should transliterate trademark symbol', () => {
      expect(slugify('Brand™', { strict: true })).toBe('brandtm');
    });
  });

  describe('unicode normalization', () => {
    it('should handle combining marks via NFKD normalization', () => {
      const cafeWithCombining = 'cafe\u0301';
      expect(slugify(cafeWithCombining)).toBe('cafe');
    });
  });

  describe('combined options', () => {
    it('should handle all options together', () => {
      expect(slugify('  Héllo Wörld!  ', {
        replacement: '_',
        lower: true,
        strict: true,
        trim: true,
      })).toBe('hello_world');
    });

    it('should handle locale with strict mode', () => {
      expect(slugify('Ärger & Ärger!', {
        locale: 'de',
        strict: true,
      })).toBe('aerger-and-aerger');
    });
  });
});
