import { computed, type ComputedRef, type Ref } from 'vue';
import type { ColorScheme, VsComponent } from '@/declaration';
import { useOptionsStore } from '@/stores';

export function useColorScheme(component: VsComponent | string, colorScheme: Ref<ColorScheme | undefined>) {
    const optionsStore = useOptionsStore();

    // 'none' is kept as-is so that child components receiving it also render the default theme
    const computedColorScheme: ComputedRef<ColorScheme | undefined> = computed(
        () => colorScheme.value || optionsStore.colorScheme.value[component] || optionsStore.colorScheme.value.default,
    );

    const colorSchemeClass = computed(() => {
        const scheme = computedColorScheme.value;
        return `vs-cs-${scheme && scheme !== 'none' ? scheme : 'default'}`;
    });

    return {
        computedColorScheme,
        colorSchemeClass,
    };
}
