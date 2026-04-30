import type { PropType } from 'vue';
import type { Placement, Alignment } from '@/declaration';

export function getFloatingProps(
    defaultValues: {
        placement: Placement;
        align: Alignment;
        margin: number;
    } = {
        placement: 'bottom',
        align: 'start',
        margin: 5,
    },
) {
    return {
        align: {
            type: String as PropType<Alignment>,
            default: defaultValues.align,
        },
        disabled: { type: Boolean, default: false },
        enterDelay: { type: [String, Number], default: 0 },
        leaveDelay: { type: [String, Number], default: 0 },
        margin: { type: [String, Number], default: defaultValues.margin },
        noAnimation: { type: Boolean, default: false },
        placement: {
            type: String as PropType<Placement>,
            default: defaultValues.placement,
        },
    };
}
