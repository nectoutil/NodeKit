import forge from 'node-forge';
import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

import { md5 } from '../src/index';

function forgeMd5(data: string | Uint8Array): string {
  const md = forge.md.md5.create();
  md.update(
    typeof data === 'string'
      ? data
      : forge.util.createBuffer(data).getBytes(),
    'raw'
  );
  return md.digest().toHex();
}

describe('md5', () => {
  it('should match node-forge for empty string', () => {
    expect(md5('')).toBe(forgeMd5(''));
  });

  it('should match node-forge for known string', () => {
    expect(md5('hello world')).toBe(forgeMd5('hello world'));
  });

  it('should match node-forge for binary data', () => {
    const data = new Uint8Array([0x00, 0xff, 0x80, 0x7f, 0x01]);
    expect(md5(data)).toBe(forgeMd5(data));
  });

  it('should return a 32-character hex string', () => {
    expect(md5('test')).toMatch(/^[0-9a-f]{32}$/);
  });

  it('should return a 16-byte Uint8Array in raw encoding', () => {
    const result = md5('test', 'raw');
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result).toHaveLength(16);
  });

  it('should match node-forge for any string input', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        return md5(input) === forgeMd5(input);
      })
    );
  });

  it('should produce different hashes for different inputs', () => {
    fc.assert(
      fc.property(
        fc.string(), fc.string(),
        (a, b) => {
          fc.pre(a !== b);
          return md5(a) !== md5(b);
        }
      )
    );
  });
});
