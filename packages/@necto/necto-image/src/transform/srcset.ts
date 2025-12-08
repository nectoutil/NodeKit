/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Parses a dimension value to a number */
export function parseDimension(
  value: number | string | undefined
): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  const parsed: number = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? undefined : parsed;
}

/** Infers width/height from props and aspect ratio */
export function inferDimensions(props: {
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
}): { width?: number; height?: number } {
  let width: number | undefined = parseDimension(props.width);
  let height: number | undefined = parseDimension(props.height);

  if (props.aspectRatio) {
    if (width && !height) {
      height = Math.round(width / props.aspectRatio);
    } else if (height && !width) {
      width = Math.round(height * props.aspectRatio);
    }
  }

  return { width, height };
}
