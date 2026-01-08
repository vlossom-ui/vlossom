import type { PropType } from 'vue';
import type { Size } from '@/declaration';

export function getButtonProps() {
    return {
        circle: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        ghost: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        responsive: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },
        type: {
            type: String as PropType<'button' | 'submit' | 'reset'>,
            default: 'button',
        },
    };
}
