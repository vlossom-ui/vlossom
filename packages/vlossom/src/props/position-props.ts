import type { PropType } from 'vue';

export function getPositionProps() {
    return {
        position: {
            type: String as PropType<'relative' | 'absolute' | 'fixed' | 'sticky' | 'static'>,
        },
    };
}
