import type { Message, Rule, UIState } from '@/declaration';
import { objectUtil } from '@/utils';

import type { PropType } from 'vue';

interface InputProps<T> {
    disabled: { type: BooleanConstructor; default: boolean };
    id: { type: StringConstructor; default: string };
    label: { type: StringConstructor; default: string };
    messages: { type: PropType<Message<T>[]>; default: () => Message<T>[] };
    name: { type: StringConstructor; default: string };
    noDefaultRules: { type: BooleanConstructor; default: boolean };
    noMessage: { type: BooleanConstructor; default: boolean };
    placeholder: { type: StringConstructor; default: string };
    readonly: { type: BooleanConstructor; default: boolean };
    required: { type: BooleanConstructor; default: boolean };
    rules: { type: PropType<Rule<T>[]>; default: () => Rule<T>[] };
    small: { type: BooleanConstructor; default: boolean };
    state: { type: PropType<UIState>; default: UIState };
    visible: { type: BooleanConstructor; default: boolean };

    // v-model
    changed: { type: BooleanConstructor; default: boolean };
    valid: { type: BooleanConstructor; default: boolean };
}

export function getInputProps<T = unknown, K extends keyof InputProps<T> = never>(
    ...excludes: K[]
): Omit<InputProps<T>, K> {
    return objectUtil.omit(
        {
            disabled: { type: Boolean, default: false },
            id: { type: String, default: '' },
            label: { type: String, default: '' },
            messages: { type: Array as PropType<Message<T>[]>, default: () => [] },
            name: { type: String, default: '' },
            noDefaultRules: { type: Boolean, default: false },
            noMessage: { type: Boolean, default: false },
            placeholder: { type: String, default: '' },
            readonly: { type: Boolean, default: false },
            required: { type: Boolean, default: false },
            rules: { type: Array as PropType<Rule<T>[]>, default: () => [] },
            small: { type: Boolean, default: false },
            state: { type: String as PropType<UIState>, default: 'idle' },
            visible: { type: Boolean, default: true },

            // v-model
            changed: { type: Boolean, default: false },
            valid: { type: Boolean, default: false },
        },
        excludes,
    );
}

export function getInputOptionProps() {
    return {
        options: { type: Array as PropType<any[]>, required: true, default: () => [] },
        optionLabel: { type: String, default: '' },
        optionValue: { type: String, default: '' },
    };
}
