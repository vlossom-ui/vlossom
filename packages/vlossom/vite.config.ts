import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools(), dts(), visualizer({ filename: 'visualizer.html' })],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
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
});
