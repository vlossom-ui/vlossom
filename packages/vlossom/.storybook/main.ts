import type { StorybookConfig } from '@storybook/vue3-vite';
import { withoutVitePlugins } from '@storybook/builder-vite';

const config: StorybookConfig = {
    stories: ['./../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },
    async viteFinal(c) {
        c.plugins = await withoutVitePlugins(c.plugins, ['unplugin-dts', 'generate-styles-dts', 'visualizer']);
        return c;
    },
};

export default config;
