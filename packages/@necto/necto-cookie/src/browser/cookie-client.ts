/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getOwnerDocument } from '@necto/dom';

import { notify, subscribe } from './emitter';
import { parseCookie } from '../parse-cookie';
import { stringifySetCookie } from '../stringify-set-cookie';

import type {
  Cookies,
  CookieListener,
  CookieAttributes,
  CookieClientOptions,
  CookieDeleteAttributes
} from '../types';

export class CookieClient {
  private readonly defaults: CookieAttributes;
  private readonly encode?: (value: string) => string;
  private readonly decode?: (value: string) => string;

  public constructor(options: CookieClientOptions = {}) {
    this.defaults = options.attributes ?? {};
    this.encode = options.encode;
    this.decode = options.decode;
  }

  public get = (name: string): string | undefined => {
    return this.read()[name];
  };

  public getAll = (): Cookies => {
    return this.read();
  };

  public has = (name: string): boolean => {
    return name in this.read();
  };

  public set = (name: string, value: string, attributes: CookieAttributes = {}): void => {
    this.write(name, value, { ...this.defaults, ...attributes });
  };

  public delete = (name: string, attributes: CookieDeleteAttributes = {}): void => {
    this.write(name, '', { ...this.defaults, ...attributes, maxAge: 0, expires: undefined });
  };

  public subscribe = (name: string, listener: CookieListener): (() => void) => {
    let last: string | undefined = this.get(name);

    // Several sources can report the same change, so only call the listener when the value differs.
    return subscribe(name, (): void => {
      const next: string | undefined = this.get(name);

      if (next !== last) {
        last = next;
        listener(next);
      }
    });
  };

  public withAttributes = (attributes: CookieAttributes): CookieClient => {
    return new CookieClient({
      encode: this.encode,
      decode: this.decode,
      attributes: { ...this.defaults, ...attributes }
    });
  };

  private read(): Cookies {
    const doc: Document | null = getOwnerDocument(null);

    if (!doc) {
      return Object.create(null);
    }

    return parseCookie(doc.cookie, { decode: this.decode });
  }

  private write(name: string, value: string, attributes: CookieAttributes): void {
    if (attributes.httpOnly) {
      throw new TypeError(`Cookie "${name}" cannot be HttpOnly when set from the browser`);
    }

    // Stringify before browser check, thus invalid cookies throw in SSR too.
    const header: string = stringifySetCookie(
      {
        ...attributes,
        name,
        value
      },
      {
        encode: this.encode
      }
    );

    const doc: Document | null = getOwnerDocument(null);

    if (!doc) {
      return;
    }

    doc.cookie = header;
    notify(name);
  }
}
