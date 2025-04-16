/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isNode } from "./node";

export function isShadowRoot(node: Node | null): node is ShadowRoot {
  return isNode(node) &&
    node.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
    'host' in node;
}