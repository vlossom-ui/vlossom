import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { commonConfig } from './vite.config.common';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
    ...commonConfig,
    plugins: [
        ...commonConfig.plugins,
        vueDevTools(),
        visualizer({
            filename: 'visualizer-playground.html',
        }),
    ],
    build: {
        outDir: 'dist-playground',
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL('./index.html', import.meta.url)),
            },
        },
    },
});
