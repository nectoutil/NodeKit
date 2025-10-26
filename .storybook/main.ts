import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Load stories from all @necto-react packages
  stories: [
    '../packages/@necto-react/**/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
