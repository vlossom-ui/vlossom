import type { PropType } from 'vue';

export function getOptionsProps() {
    return {
        options: { type: Array as PropType<any[]>, default: () => [] },
        optionLabel: { type: String, default: '' },
        optionValue: { type: String, default: '' },
    };
}

export function getGroupByProps() {
    return {
        groupBy: {
            type: Function as PropType<(option: any, index: number) => string | null> | null,
            default: null,
        },
        groupOrder: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
    };
}
