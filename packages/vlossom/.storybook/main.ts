import type { StorybookConfig } from '@storybook/vue3-vite';
import { withoutVitePlugins } from '@storybook/builder-vite';

const config: StorybookConfig = {
    stories: ['./../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-a11y'],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },
    async viteFinal(c) {
        c.plugins = await withoutVitePlugins(c.plugins, ['vite:dts', 'generate-styles-dts', 'visualizer']);
        return c;
    },
};

export default config;
