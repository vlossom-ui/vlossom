/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import { commonConfig } from './vite.config.common';

// https://vite.dev/config/
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const storybookPlugins =
    process.env.NODE_ENV !== 'production' ? [storybookTest({ configDir: path.join(dirname, '.storybook') })] : [];

export default defineConfig({
    ...commonConfig,
    plugins: [
        ...commonConfig.plugins,
        dts({
            tsconfigPath: './tsconfig.app.json',
            rollupTypes: true,
            insertTypesEntry: true,
        }),
        visualizer({
            filename: 'visualizer-vlossom.html',
        }),
    ],
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/main.ts', import.meta.url)),
            name: 'Vlossom',
            fileName: (format) => `vlossom.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    test: {
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    environment: 'jsdom',
                    root: fileURLToPath(new URL('./', import.meta.url)),
                    include: ['src/**/*.test.ts'],
                    exclude: ['src/**/*.stories.ts'],
                },
            },
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    ...storybookPlugins,
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: 'playwright',
                        instances: [
                            {
                                browser: 'chromium',
                            },
                        ],
                    },
                    setupFiles: ['.storybook/vitest.setup.ts'],
                },
            },
        ],
    },
});
