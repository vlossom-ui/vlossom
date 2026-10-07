// VitePress 테마 CSS보다 먼저 와야 레이어 순서가 정해진다.
import './layers.css';
import type { Theme } from 'vitepress';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { watch } from 'vue';
import './demo.css';
import './vars.css';
import { attachVlossom, syncVlossomTheme } from './vlossom.ts';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        attachVlossom(app);
    },
    setup() {
        const { isDark } = useData();
        watch(isDark, syncVlossomTheme);
    },
} satisfies Theme;
