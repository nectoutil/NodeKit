/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type XmlTextEncoding = 'utf-8' | 'utf-16be' | 'utf-16le';

export interface FileTypeResult {
  ext: string;
  mime: string;
}

export interface XmlDetectionResult {
  xml: true;
  encoding: XmlTextEncoding;
  offset: number;
}

export interface XmlDetectionFailed {
  xml: false;
}

export type XmlDetection = XmlDetectionResult | XmlDetectionFailed;

export interface XmlTextDetectorOptions {
  fullScan?: boolean;
}
