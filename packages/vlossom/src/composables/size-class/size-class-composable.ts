import { computed, type Ref } from 'vue';
import type { Size } from '@/declaration';

export function useSizeClass(size: Ref<Size | undefined>) {
    const sizeClass = computed(() => (size.value ? `vs-${size.value}` : ''));

    return {
        sizeClass,
    };
}
