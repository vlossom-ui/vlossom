// VitePress 테마 CSS보다 먼저 와야 레이어 순서가 정해진다.
import './layers.css';
import type { Theme } from 'vitepress';
import { useData, useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { watch } from 'vue';
import './demo.css';
import './vars.css';
import { attachVlossom, closeVlossomModals, syncVlossomTheme } from './vlossom.ts';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        attachVlossom(app);
    },
    setup() {
        const { isDark } = useData();
        const route = useRoute();
        watch(isDark, syncVlossomTheme);
        watch(() => route.path, closeVlossomModals);
    },
} satisfies Theme;
