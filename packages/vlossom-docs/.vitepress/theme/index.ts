import type { Theme } from 'vitepress';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { watch } from 'vue';
import './demo.css';
import { installVlossom, syncVlossomTheme } from './vlossom.ts';

export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        if (import.meta.env.SSR) {
            return;
        }
        await installVlossom(app);
    },
    setup() {
        const { isDark } = useData();
        watch(isDark, syncVlossomTheme, { immediate: true });
    },
} satisfies Theme;
