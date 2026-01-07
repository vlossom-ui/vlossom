import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

const isStorybook = process.env.npm_lifecycle_event?.includes('storybook');

// 공통 설정
export const commonConfig = {
    plugins: [vue(), !isStorybook && vueDevTools(), tailwindcss()].filter(Boolean),
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
};
