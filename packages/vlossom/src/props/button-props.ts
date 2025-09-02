import type { PropType } from 'vue';

export function getButtonModifierProps() {
    return {
        circle: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        ghost: { type: Boolean, default: false },
        large: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        responsive: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        type: {
            type: String as PropType<'button' | 'submit' | 'reset'>,
            default: 'button',
        },
        ariaLabel: { type: String, default: '' },
    };
}
