/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { XmlTextDetector } from '../xml';

export interface IsSvgOptions {
  /** Whether to fully validate the SVG structure (default: true) */
  validate?: boolean;
}

/**
 * Checks if a string contains valid SVG content using SAX parsing
 */
export function isSvg(content: string, options: IsSvgOptions = {}): boolean {
  const { validate = true } = options;

  if (typeof content !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof content}`);
  }

  const trimmed = content.trim();
  if (trimmed.length === 0) return false;

  const detector = new XmlTextDetector({ fullScan: validate });

  if (validate) {
    detector.write(trimmed);
    if (!detector.isValid()) return false;
  } else {
    const chunkSize = 128;
    let offset = 0;

    while (trimmed.length > offset && !detector.onEnd) {
      detector.write(
        trimmed.slice(offset, Math.min(offset + chunkSize, trimmed.length))
      );
      offset += chunkSize;
    }
  }

  return detector.fileType?.ext === 'svg';
}

/**
 * Quick check if content looks like SVG (without full validation)
 */
export function isSvgFast(content: string): boolean {
  return isSvg(content, { validate: false });
}
