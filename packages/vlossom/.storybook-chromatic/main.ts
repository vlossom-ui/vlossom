import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
    stories: ['./../src/**/*.chromatic.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@storybook/addon-interactions',
        '@chromatic-com/storybook',
    ],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },
};
export default config;
