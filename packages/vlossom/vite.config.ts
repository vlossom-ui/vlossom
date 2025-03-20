import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import autoprefixer from 'autoprefixer';
import { configDefaults } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools(), dts(), visualizer({ filename: 'visualizer.html' })],
    css: {
        postcss: {
            plugins: [autoprefixer],
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
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
    // https://vitest.dev/config/
    test: {
        environment: 'jsdom',
        root: fileURLToPath(new URL('./', import.meta.url)),
        setupFiles: ['src/test/setup.ts'],
        exclude: [...configDefaults.exclude, '**/stories/**', '**/*storybook/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            exclude: [...configDefaults.exclude, '**/stories/**', '**/*storybook/**'],
        },
    },
});
