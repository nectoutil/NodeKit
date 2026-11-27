/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const PathPlatforms = {
  Posix: 'posix',
  Windows: 'windows'
} as const;

export const BACKSLASH_RE: RegExp = new RegExp(/\\/g);
export const EXTNAME_RE: RegExp = new RegExp(/.(\.[^./]+|\.)$/);
export const DRIVE_LETTER_RE: RegExp = new RegExp(/^[A-Za-z]:$/);
export const IS_ABSOLUTE_RE: RegExp = new RegExp(/^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/);
