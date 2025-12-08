/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type Side = 'top' | 'right' | 'bottom' | 'left';

export type Alignment = 'start' | 'end';

export type Placement = Side | `${Side}-${Alignment}`;

export type Strategy = 'absolute' | 'fixed';

/**
 * Checks if a string is a valid Side.
 * @param value - The string to check.
 * @returns True if the value is a valid Side.
 */
export function isSide(value: string): value is Side {
  return ['top', 'right', 'bottom', 'left'].includes(value);
}

/**
 * Checks if a string is a valid Alignment.
 * @param value - The string to check.
 * @returns True if the value is a valid Alignment.
 */
export function isAlignment(value: string): value is Alignment {
  return ['start', 'end'].includes(value);
}

/**
 * Checks if a string is a valid Placement.
 * @param value - The string to check.
 * @returns True if the value is a valid Placement.
 */
export function isPlacement(value: string): value is Placement {
  const parts = value.split('-');
  if (parts.length === 1) {
    return isSide(parts[0]);
  }
  if (parts.length === 2) {
    return isSide(parts[0]) && isAlignment(parts[1]);
  }
  return false;
}

/**
 * Extracts the side from a placement.
 * @param placement - The placement to extract from.
 * @returns The side component of the placement.
 */
export function getSide(placement: Placement): Side {
  return placement.split('-')[0] as Side;
}

/**
 * Extracts the alignment from a placement.
 * @param placement - The placement to extract from.
 * @returns The alignment component, or undefined if none.
 */
export function getAlignment(placement: Placement): Alignment | undefined {
  const parts = placement.split('-');
  return parts.length === 2 ? (parts[1] as Alignment) : undefined;
}

/**
 * Gets the axis for a given side.
 * @param side - The side to get the axis for.
 * @returns 'x' for left/right, 'y' for top/bottom.
 */
export function getAxis(side: Side): 'x' | 'y' {
  return side === 'top' || side === 'bottom' ? 'y' : 'x';
}

/**
 * Gets the opposite side.
 * @param side - The side to get the opposite of.
 * @returns The opposite side.
 */
export function getOppositeSide(side: Side): Side {
  const opposites: Record<Side, Side> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  };
  return opposites[side];
}

/**
 * Gets the opposite alignment.
 * @param alignment - The alignment to get the opposite of.
 * @returns The opposite alignment.
 */
export function getOppositeAlignment(alignment: Alignment): Alignment {
  return alignment === 'start' ? 'end' : 'start';
}
