import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { commonConfig } from './vite.config.common.ts';

export default defineConfig({
    ...commonConfig,
    server: {
        ...commonConfig.server,
        host: '127.0.0.1',
        port: 4174,
        open: false,
    },
    build: {
        outDir: 'dist-e2e',
        rollupOptions: {
            input: {
                modalBackClose: fileURLToPath(new URL('./e2e/modal-back-close.html', import.meta.url)),
            },
        },
    },
});
