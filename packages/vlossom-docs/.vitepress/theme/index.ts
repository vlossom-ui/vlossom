import './layers.css';
import type { Theme } from 'vitepress';
import { useData, useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h, watch } from 'vue';
import DemoOptions from './DemoOptions.vue';
import './demo.css';
import './vars.css';
import { attachVlossom, closeVlossomModals, followVlossomTheme, syncVlossomTheme } from './vlossom.ts';

export default {
    extends: DefaultTheme,
    Layout: () => h(DefaultTheme.Layout, null, { 'layout-bottom': () => h(DemoOptions) }),
    enhanceApp({ app }) {
        attachVlossom(app);
    },
    setup() {
        const { isDark } = useData();
        const route = useRoute();
        watch(isDark, syncVlossomTheme);
        followVlossomTheme(isDark);
        watch(() => route.path, closeVlossomModals);
    },
} satisfies Theme;
