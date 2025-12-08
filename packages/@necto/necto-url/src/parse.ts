/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ParsedUrl } from './types';

/**
 * Parses a URL string using the WHATWG URL API and returns its key components.
 *
 * @param url - The URL to parse. Can be absolute, or relative if `base` is provided.
 * @param base - Optional base URL used to resolve relative `url` (e.g., "https://example.com").
 * @returns A parsed URL object on success, or `null` if the URL is invalid.
 */
export function parseUrl(url: string, base?: string): ParsedUrl | null {
  try {
    const parsed = new URL(url, base);

    const searchParams: Record<string, string> = {};
    parsed.searchParams.forEach((value: string, key: string): void => {
      searchParams[key] = value;
    });

    return {
      href: parsed.href,
      protocol: parsed.protocol,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin,
      searchParams
    };
  } catch {
    return null;
  }
}
