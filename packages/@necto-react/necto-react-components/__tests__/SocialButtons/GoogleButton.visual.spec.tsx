/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { GoogleButton } from '../../src/SocialButtons/Google/Google';

test.describe('GoogleButton Visual Tests', () => {
  test('should render Google button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <GoogleButton />
        <GoogleButton showIcon={false}>Without Icon</GoogleButton>
        <GoogleButton iconPosition="right">Icon Right</GoogleButton>
        <GoogleButton disabled>Disabled</GoogleButton>
      </div>
    );
    await expect(component).toHaveScreenshot('google-button-states.png');
  });
});
