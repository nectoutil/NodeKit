/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function isShadowRoot(node: Node | null): node is ShadowRoot {
  return (
    node !== null &&
    typeof node === 'object' &&
    'nodeType' in node &&
    typeof node.nodeType === 'number' &&
    node.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
    'host' in node
  );
}
