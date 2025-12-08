/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ImageComponent from './component.vue';

import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof ImageComponent> = {
  title: 'Components/Image',
  component: ImageComponent,
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    aspectRatio: { control: 'number' },
    sizes: { control: 'text' },
    layout: {
      control: 'select',
      options: ['fixed', 'constrained', 'fullWidth']
    },
    priority: { control: 'boolean' },
    background: { control: 'color' },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down']
    },
    unstyled: { control: 'boolean' },
    custom: { control: 'boolean' },
    inline: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<typeof ImageComponent>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    alt: 'A beautiful landscape',
    width: 800,
    height: 600
  }
};
