import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { commonConfig } from './vite.config.common';

// https://vite.dev/config/
export default defineConfig({
    ...commonConfig,
    build: {
        outDir: 'dist-sandbox',
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL('./index.html', import.meta.url)),
            },
        },
    },
});
