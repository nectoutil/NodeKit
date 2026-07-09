/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as DOM from './dom';
import * as SVG from './svg';
import * as CSS from './css';
import * as HTTP from './http';
import * as IMAGE from './image';
import * as VIDEO from './video';
import CHAR_MAP from './charmap.json' with { type: 'json' };
import * as ANCHOR from './anchor.json' with { type: 'json' };
import LOCALE_MAP from './localemap.json' with { type: 'json' };
import * as NUMBERS from './numbers.json' with { type: 'json' };
import * as CHARS from './characters.json' with { type: 'json' };
import * as ALPHABET from './alphabet.json' with { type: 'json' };

export {
  VIDEO,
  CHARS,
  ALPHABET,
  NUMBERS,
  DOM,
  SVG,
  CSS,
  HTTP,
  ANCHOR,
  CHAR_MAP,
  LOCALE_MAP,
  IMAGE
};
