/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type * from './types';
export * from './types';

export { computePosition } from './core/computePosition';
export { getElementRects } from './core/getElementRects';

export { offset } from './middlewares/offset';
export type { OffsetOptions } from './middlewares/offset';

export { flip } from './middlewares/flip';
export type { FlipOptions } from './middlewares/flip';

export { shift } from './middlewares/shift';
export type { ShiftOptions } from './middlewares/shift';

export { arrow } from './middlewares/arrow';
export type { ArrowOptions } from './middlewares/arrow';

export { size } from './middlewares/size';
export type { SizeOptions } from './middlewares/size';

export { autoPlacement } from './middlewares/autoPlacement';
export type { AutoPlacementOptions } from './middlewares/autoPlacement';

export { hide } from './middlewares/hide';
export type { HideOptions } from './middlewares/hide';

export { computeCoords } from './utils/getPlacementCoords';
export { detectOverflow, hasOverflow } from './utils/detectOverflow';
export { autoUpdate } from './utils/autoUpdate';
export type { AutoUpdateOptions } from './utils/autoUpdate';

export {
  getContainmentRect,
  isNode,
  getOwnerWindow,
  getOwnerDocument
} from '@necto/dom';
