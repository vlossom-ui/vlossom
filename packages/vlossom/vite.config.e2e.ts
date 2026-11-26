import { defineConfig } from 'vite';
import { commonConfig } from './vite.config.common.ts';

export default defineConfig({
    ...commonConfig,
    server: {
        ...commonConfig.server,
        host: '127.0.0.1',
        port: 4174,
        open: false,
    },
});
