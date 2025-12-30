import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { commonConfig } from './vite.config.common';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
    ...commonConfig,
    plugins: [
        ...commonConfig.plugins,
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
