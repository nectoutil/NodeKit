/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { DiscordButton } from '../../src/SocialButtons/Discord/Discord';

test.describe('DiscordButton Visual Tests', () => {
  test('should render Discord button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <DiscordButton />
        <DiscordButton showIcon={false}>Without Icon</DiscordButton>
        <DiscordButton iconPosition="right">Icon Right</DiscordButton>
        <DiscordButton disabled>Disabled</DiscordButton>
      </div>
    );
    await expect(component).toHaveScreenshot('discord-button-states.png');
  });
});
