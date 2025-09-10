import type { PropType } from 'vue';
import type { CssPosition } from '@/declaration';

export function getPositionProps() {
    return {
        position: {
            type: String as PropType<CssPosition>,
        },
    };
}
