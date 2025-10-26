/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { DropboxButton } from '../../src/SocialButtons/Dropbox/Dropbox';

test.describe('DropboxButton Visual Tests', () => {
  test('should render Dropbox button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <DropboxButton />
        <DropboxButton showIcon={false}>Without Icon</DropboxButton>
        <DropboxButton iconPosition="right">Icon Right</DropboxButton>
        <DropboxButton disabled>Disabled</DropboxButton>
      </div>
    );
    await expect(component).toHaveScreenshot('dropbox-button-states.png');
  });
});
