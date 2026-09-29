import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'vlossom/styles';
import './demo.css';
import ColorPalette from './ColorPalette.vue';
import Layout from './Layout.vue';
import { installVlossom } from './vlossom.ts';

export default {
    extends: DefaultTheme,
    Layout,
    async enhanceApp({ app }) {
        app.component('ColorPalette', ColorPalette);

        if (import.meta.env.SSR) {
            return;
        }

        await installVlossom(app);
    },
} satisfies Theme;
