/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const HAS_SPACE = new RegExp(/\s/);
export const CAM_SPLITTER = new RegExp(/(.)([A-Z]+)/g);
export const HAS_SEPARATOR = new RegExp(/(_|-|\.|:)/);
export const SEP_SPLITTER = new RegExp(/[\W_]+(.|$)/g);
export const HAS_CAMEL = new RegExp(/([a-z][A-Z]|[A-Z][a-z])/);
