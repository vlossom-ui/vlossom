import type { PropType } from 'vue';
import type { Breakpoints } from '@/declaration';

export function getResponsiveProps() {
    return {
        width: {
            type: [String, Number, Object] as PropType<string | number | Breakpoints>,
        },
        grid: {
            type: [String, Number, Object] as PropType<string | number | Breakpoints>,
        },
    };
}

export function getGridProps() {
    return {
        gridSize: { type: [Number, String] },
        columnGap: { type: [Number, String] },
        rowGap: { type: [Number, String] },
    };
}
