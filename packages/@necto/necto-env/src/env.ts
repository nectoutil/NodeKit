/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import process from 'node:process';

import type { EnvOptions } from './types';
import type { EnvObject } from '@necto/types';

const globalEnvOptions: EnvOptions = {
  throwErrors: false,
  logWarnings: true
};

export function getEnv(key: string, options?: EnvOptions): string | undefined {
  const opts = { ...globalEnvOptions, ...options };

  let currentRuntime: 'deno' | 'bun' | 'node' | 'unknown' = 'unknown';
  if (typeof Deno !== 'undefined' && typeof Deno.env?.get === 'function') {
    currentRuntime = 'deno';
  } else if (typeof Bun !== 'undefined' && Bun.env) {
    currentRuntime = 'bun';
  } else if (typeof process !== 'undefined' && process.env) {
    currentRuntime = 'node';
  }

  switch (currentRuntime) {
    case 'deno':
      // @ts-ignore
      return Deno.env.get(key);
    case 'bun':
      // @ts-ignore
      return Bun.env[key];
    case 'node':
      return process.env[key];
    default:
      if (opts.throwErrors) {
        throw new Error('Unsupported environment');
      }

      if (opts.logWarnings) {
        console.warn('Unsupported runtime');
      }

      return undefined;
  }
}

export const env = new Proxy<EnvObject>({} as EnvObject, {
  get(_, prop: string) {
    return getEnv(prop);
  },
  has(_, prop: string) {
    return getEnv(prop) !== undefined;
  },
  set(_, prop: string, value: string) {
    if (typeof process !== 'undefined' && process.env) {
      process.env[prop] = value;
      return true;
    }
    if (typeof Bun !== 'undefined' && Bun.env) {
      Bun.env[prop] = value;
      return true;
    }

    return false;
  },
  deleteProperty(_, prop: string) {
    if (typeof process !== 'undefined' && process.env) {
      delete process.env[prop];
      return true;
    }
    if (typeof Bun !== 'undefined' && Bun.env) {
      delete Bun.env[prop];
      return true;
    }

    return false;
  },
  ownKeys() {
    if (
      typeof Deno !== 'undefined' &&
      typeof Deno.env?.toObject === 'function'
    ) {
      // @ts-ignore
      return Object.keys(Deno.env.toObject());
    }
    if (typeof Bun !== 'undefined' && Bun.env) {
      // @ts-ignore
      return Object.keys(Bun.env);
    }
    if (typeof process !== 'undefined' && process.env) {
      return Object.keys(process.env);
    }
    return [];
  }
});

export const nodeEnv = process?.env?.NODE_ENV ?? '';
