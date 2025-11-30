/**
 * Placement and positioning types
 * Using advanced TypeScript for type safety
 */

/**
 * The four primary sides where an element can be placed
 */
export type Side = 'top' | 'right' | 'bottom' | 'left';

/**
 * Alignment within a side
 */
export type Alignment = 'start' | 'end';

/**
 * All possible placements using template literal types
 * Generates: 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', etc.
 */
export type Placement = Side | `${Side}-${Alignment}`;

/**
 * Positioning strategy for the floating element
 */
export type Strategy = 'absolute' | 'fixed';

/**
 * Type guard to check if a string is a valid Side
 */
export function isSide(value: string): value is Side {
  return ['top', 'right', 'bottom', 'left'].includes(value);
}

/**
 * Type guard to check if a string is a valid Alignment
 */
export function isAlignment(value: string): value is Alignment {
  return ['start', 'end'].includes(value);
}

/**
 * Type guard to check if a string is a valid Placement
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
 * Extract the side from a placement
 * @example
 * getSide('top-start') // 'top'
 * getSide('bottom') // 'bottom'
 */
export function getSide(placement: Placement): Side {
  return placement.split('-')[0] as Side;
}

/**
 * Extract the alignment from a placement (if any)
 * @example
 * getAlignment('top-start') // 'start'
 * getAlignment('bottom') // undefined
 */
export function getAlignment(placement: Placement): Alignment | undefined {
  const parts = placement.split('-');
  return parts.length === 2 ? (parts[1] as Alignment) : undefined;
}

/**
 * Get the axis for a given side
 */
export function getAxis(side: Side): 'x' | 'y' {
  return side === 'top' || side === 'bottom' ? 'y' : 'x';
}

/**
 * Get the opposite side
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
 * Get the opposite alignment
 */
export function getOppositeAlignment(alignment: Alignment): Alignment {
  return alignment === 'start' ? 'end' : 'start';
}
