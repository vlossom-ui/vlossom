import type { StorybookConfig } from '@storybook/vue3-vite';
import { withoutVitePlugins } from '@storybook/builder-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.chromatic.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-a11y'],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },
    async viteFinal(c) {
        c.plugins = await withoutVitePlugins(c.plugins, ['vite:dts', 'vite-plugin-inspect']);
        return c;
    },
};
export default config;
