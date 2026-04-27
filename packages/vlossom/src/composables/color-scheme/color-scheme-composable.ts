import { computed, type ComputedRef, type Ref } from 'vue';
import type { ColorScheme, VsComponent } from '@/declaration';
import { useOptionsStore } from '@/stores';

export function useColorScheme(component: VsComponent | string, colorScheme: Ref<ColorScheme | undefined>) {
    const optionsStore = useOptionsStore();

    const computedColorScheme: ComputedRef<ColorScheme | undefined> = computed(() => {
        if (colorScheme.value === 'none') {
            return undefined;
        }

        return (
            colorScheme.value ||
            optionsStore.colorScheme.value[component] ||
            optionsStore.colorScheme.value.default ||
            undefined
        );
    });

    const colorSchemeClass = computed(() => `vs-cs-${computedColorScheme.value || 'default'}`);

    return {
        computedColorScheme,
        colorSchemeClass,
    };
}
