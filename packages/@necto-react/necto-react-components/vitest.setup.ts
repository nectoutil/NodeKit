/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from 'vitest';
import '@testing-library/jest-dom';
import { matchers as emotionMatchers } from '@emotion/jest';

expect.extend(emotionMatchers);
