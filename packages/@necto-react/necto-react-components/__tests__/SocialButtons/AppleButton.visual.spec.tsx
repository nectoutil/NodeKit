/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { AppleButton } from '../../src/SocialButtons/Apple/Apple';

test.describe('AppleButton Visual Tests', () => {
  test('should render Apple button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <AppleButton />
        <AppleButton showIcon={false}>Without Icon</AppleButton>
        <AppleButton iconPosition="right">Icon Right</AppleButton>
        <AppleButton disabled>Disabled</AppleButton>
      </div>
    );
    await expect(component).toHaveScreenshot('apple-button-states.png');
  });
});
