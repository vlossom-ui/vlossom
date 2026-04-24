import { type Ref, computed } from 'vue';
import type { UIState } from '@/declaration';

export function useStateClass(state: Ref<UIState>) {
    const isStated = computed(() => {
        const stated = ['info', 'success', 'error', 'warning'];
        return stated.includes(state.value);
    });

    const stateClasses = computed(() => {
        if (!isStated.value) {
            return {};
        }

        return {
            'vs-stated': isStated.value,
            [`vs-state-${state.value}`]: isStated.value,
        };
    });

    const stateBoxClasses = computed(() => {
        if (!isStated.value) {
            return {};
        }

        return {
            'vs-state-box': isStated.value,
            ...stateClasses.value,
        };
    });

    return {
        isStated,
        stateClasses,
        stateBoxClasses,
    };
}
