/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare class Color {
  constructor(object: any, model?: string);

  toHex(): string;

  toRgba(): string;

  get hexa(): string;

  alpha(value: number);
}

export default Color;

export function toHex(color: string): string;
