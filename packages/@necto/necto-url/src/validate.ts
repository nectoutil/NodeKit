/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ABSOLUTE_URL_REGEX: RegExp = /^[A-Za-z][A-Za-z0-9+.-]*:/;
const DATA_URL_REGEX: RegExp = /^data:/i;
const BLOB_URL_REGEX: RegExp = /^blob:/i;
const ALLOWED_SCHEMES_REGEX: RegExp = /^(https?|data|blob):/i;
const RELATIVE_PATH_REGEX: RegExp = /^(?:\/|\.\/|\.\.\/)/;
const PROTOCOL_RELATIVE_REGEX: RegExp = /^\/\//;
const WINDOWS_BACKSLASH_PATH_REGEX: RegExp = /^(?:\\|\.\\|\.\.\\)/;

/**
 * Checks if value is a URL (absolute, relative path, or data URL)
 */
export function isUrl(value?: string | null): value is string {
  if (!value) return false;

  const input: string = value.trim();
  if (!input) return false;

  // Explicitly reject Windows backslash paths
  if (WINDOWS_BACKSLASH_PATH_REGEX.test(input)) return false;

  return (
    ALLOWED_SCHEMES_REGEX.test(input) ||
    RELATIVE_PATH_REGEX.test(input) ||
    PROTOCOL_RELATIVE_REGEX.test(input)
  );
}

/**
 * Checks if value is an absolute URL with a protocol
 */
export function isAbsoluteUrl(value?: string | null): value is string {
  if (!value) return false;
  return ABSOLUTE_URL_REGEX.test(value.trim());
}

/**
 * Checks if value is a relative URL (starts with /, ./, or ../)
 */
export function isRelativeUrl(value?: string | null): value is string {
  if (!value) return false;
  const input: string = value.trim();

  return RELATIVE_PATH_REGEX.test(input) || PROTOCOL_RELATIVE_REGEX.test(input);
}
/**
 * Checks if value is a data URL
 */
export function isDataUrl(value?: string | null): value is string {
  if (!value) return false;
  return DATA_URL_REGEX.test(value.trim());
}

/**
 * Checks if value is a blob URL
 */
export function isBlobUrl(value?: string | null): value is string {
  if (!value) return false;
  return BLOB_URL_REGEX.test(value.trim());
}
