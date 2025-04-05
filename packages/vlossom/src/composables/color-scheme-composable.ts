import { computed, type Ref } from 'vue';
import { useVlossom } from '@/vlossom-framework';

import type { ColorScheme } from '@/declaration';

export function useColorScheme(component: string, colorScheme: Ref<ColorScheme | undefined>) {
    const $vs = useVlossom();

    const computedColorScheme = computed(
        () => colorScheme.value || $vs.stores.option.getGlobalColorScheme(component) || undefined,
    );

    const colorSchemeClass = computed(() => `vs-${computedColorScheme.value || 'none'}`);

    return {
        computedColorScheme,
        colorSchemeClass,
    };
}
