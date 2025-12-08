/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sax from 'sax';

import type {
  FileTypeResult,
  XmlTextDetectorOptions,
  XmlDetection,
  XmlTextEncoding
} from './types';

/** Maps root element namespace to file type */
const namespaceMapping: Record<string, FileTypeResult> = {
  'http://www.w3.org/2000/svg': { ext: 'svg', mime: 'image/svg+xml' },
  'http://www.w3.org/1999/xhtml': {
    ext: 'xhtml',
    mime: 'application/xhtml+xml'
  },
  'http://www.opengis.net/kml/2.2': {
    ext: 'kml',
    mime: 'application/vnd.google-earth.kml+xml'
  },
  'http://www.opengis.net/gml': { ext: 'gml', mime: 'application/gml+xml' }
};

/** Maps root element name to file type (for non-namespaced XML) */
const rootNameMapping: Record<string, FileTypeResult> = {
  rss: { ext: 'rss', mime: 'application/rss+xml' },
  'score-partwise': {
    ext: 'musicxml',
    mime: 'application/vnd.recordare.musicxml+xml'
  },
  svg: { ext: 'svg', mime: 'image/svg+xml' }
};

function startsWith(
  array: Uint8Array | number[],
  prefix: Uint8Array | number[]
): boolean {
  if (prefix.length > array.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (array[i] !== prefix[i]) return false;
  }
  return true;
}

function hasXmlTag(xmlString: string): boolean {
  return /^<\s*\w+(?=\s+[^<>]*=|>)/.test(xmlString);
}

function hasArrayXmlTag(array: Uint8Array, encoding: string): boolean {
  const textDecoder = new TextDecoder(encoding);
  return hasXmlTag(textDecoder.decode(array));
}

/** Detects if a byte array contains XML and its encoding */
export function isXml(array: Uint8Array): XmlDetection {
  // UTF-8 XML declaration
  if (startsWith(array, [60, 63, 120, 109, 108, 32])) {
    return { xml: true, encoding: 'utf-8', offset: 0 };
  }

  // UTF-8 BOM
  if (startsWith(array, [0xef, 0xbb, 0xbf])) {
    const encoding: XmlTextEncoding = 'utf-8';
    if (
      startsWith(array.subarray(3), [60, 63, 120, 109, 108, 32]) ||
      hasArrayXmlTag(array, encoding)
    ) {
      return { xml: true, encoding, offset: 3 };
    }
  }

  // UTF-16BE BOM
  if (startsWith(array, [0xfe, 0xff])) {
    const encoding: XmlTextEncoding = 'utf-16be';
    if (
      startsWith(
        array.subarray(2),
        [0, 60, 0, 63, 0, 120, 0, 109, 0, 108, 0, 32]
      ) ||
      hasArrayXmlTag(array, encoding)
    ) {
      return { xml: true, encoding, offset: 2 };
    }
  }

  // UTF-16LE BOM
  if (startsWith(array, [0xff, 0xfe])) {
    const encoding: XmlTextEncoding = 'utf-16le';
    if (
      startsWith(
        array.subarray(2),
        [60, 0, 63, 0, 120, 0, 109, 0, 108, 0, 32, 0]
      ) ||
      hasArrayXmlTag(array, encoding)
    ) {
      return { xml: true, encoding, offset: 2 };
    }
    return { xml: true, encoding: 'utf-16le', offset: 2 };
  }

  // UTF-16BE without BOM
  if (startsWith(array, [0, 60, 0, 63, 0, 120, 0, 109, 0, 108, 0, 32])) {
    return { xml: true, encoding: 'utf-16be', offset: 0 };
  }

  // UTF-16LE without BOM
  if (startsWith(array, [60, 0, 63, 0, 120, 0, 109, 0, 108, 0, 32, 0])) {
    return { xml: true, encoding: 'utf-16le', offset: 0 };
  }

  // Fallback: check for XML tag in UTF-8
  if (hasArrayXmlTag(array, 'utf-8')) {
    return { xml: true, encoding: 'utf-8', offset: 0 };
  }

  return { xml: false };
}

/** SAX-based XML text detector for determining file type from XML content */
export class XmlTextDetector {
  private options: XmlTextDetectorOptions;
  private firstTag: boolean;
  private parser: sax.SAXParser;
  private nesting: number;

  public onEnd: boolean;
  public fileType?: FileTypeResult;

  constructor(options?: XmlTextDetectorOptions) {
    this.options = options ?? {};
    this.firstTag = true;
    this.onEnd = false;
    this.nesting = 0;
    this.parser = sax.parser(true, { xmlns: true });

    this.parser.onerror = (e) => {
      // Allow entity reference errors
      if (e.message.startsWith('Invalid character entity')) return;
      this.fileType = undefined;
      this.onEnd = true;
    };

    this.parser.onopentag = (node) => {
      ++this.nesting;
      if (!this.firstTag || this.onEnd) return;

      this.firstTag = false;

      if ((node as sax.QualifiedTag).uri) {
        this.fileType = namespaceMapping[(node as sax.QualifiedTag).uri];
      } else if (node.name) {
        this.fileType = rootNameMapping[node.name.toLowerCase()];
      }

      if (this.fileType && !this.options.fullScan) {
        this.onEnd = true;
      }
    };

    this.parser.onclosetag = () => {
      --this.nesting;
    };
  }

  write(text: string): void {
    this.parser.write(text);
  }

  close(): void {
    this.parser.close();
    this.onEnd = true;
  }

  isValid(): boolean {
    return this.nesting === 0;
  }
}
