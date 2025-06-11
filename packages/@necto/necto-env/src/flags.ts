/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { nodeEnv, env } from './env';

export const isTest = nodeEnv === 'test' || Boolean(env.TEST);