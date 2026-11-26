/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { basename } from './basename';
import { dirname } from './dirname';
import { extname } from './extname';

import type { Path } from './types';

const path: Path = {
  sep: '/',
  basename,
  dirname,
  extname,
  delimiter: ':'
};

export default path;
