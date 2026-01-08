import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { devConfig } from './vite.config.dev';

// https://vite.dev/config/
export default defineConfig({
    ...devConfig,
    plugins: [
        ...devConfig.plugins,
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
