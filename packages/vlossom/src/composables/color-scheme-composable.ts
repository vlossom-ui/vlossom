import { computed, type ComputedRef, type Ref } from 'vue';
import type { ColorScheme, VsComponent } from '@/declaration';
import { useOptionsStore } from '@/stores';

export function useColorScheme(component: VsComponent | string, colorScheme: Ref<ColorScheme | undefined>) {
    const optionsStore = useOptionsStore();

    const computedColorScheme: ComputedRef<ColorScheme | undefined> = computed(
        () => colorScheme.value || optionsStore.colorScheme.value[component] || undefined,
    );

    const colorSchemeClass = computed(() => `vs-color-scheme-${computedColorScheme.value || 'default'}`);

    return {
        computedColorScheme,
        colorSchemeClass,
    };
}
