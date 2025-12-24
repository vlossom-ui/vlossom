import type { PropType } from 'vue';
import type { Message, Rule, UIState } from '@/declaration';
import { objectUtil } from '@/utils';

interface InputWrapperPropsDefinition {
    disabled: { type: typeof Boolean; default: boolean };
    hidden: { type: typeof Boolean; default: boolean };
    id: { type: typeof String; default: string };
    label: { type: typeof String; default: string };
    noLabel: { type: typeof Boolean; default: boolean };
    noMessages: { type: typeof Boolean; default: boolean };
    required: { type: typeof Boolean; default: boolean };
    small: { type: typeof Boolean; default: boolean };
}

export function getInputWrapperProps(): InputWrapperPropsDefinition {
    return {
        disabled: { type: Boolean, default: false },
        hidden: { type: Boolean, default: false },
        id: { type: String, default: '' },
        label: { type: String, default: '' },
        noLabel: { type: Boolean, default: false },
        noMessages: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
    };
}

interface InputPropsDefinition<T = unknown> extends InputWrapperPropsDefinition {
    messages: { type: PropType<Message<T>[]>; default: () => Message<T>[] };
    name: { type: typeof String; default: string };
    noDefaultRules: { type: typeof Boolean; default: boolean };
    placeholder: { type: typeof String; default: string };
    readonly: { type: typeof Boolean; default: boolean };
    rules: { type: PropType<Rule<T>[]>; default: () => Rule<T>[] };
    state: { type: PropType<UIState>; default: UIState };

    changed: { type: typeof Boolean; default: boolean };
    valid: { type: typeof Boolean; default: boolean };
}

export function getInputProps<T = unknown, K extends keyof InputPropsDefinition<T> = never>(...excludes: K[]) {
    return objectUtil.omit<InputPropsDefinition<T>, K>(
        {
            ...getInputWrapperProps(),
            messages: { type: Array as PropType<Message<T>[]>, default: () => [] },
            name: { type: String, default: '' },
            noDefaultRules: { type: Boolean, default: false },
            placeholder: { type: String, default: '' },
            readonly: { type: Boolean, default: false },
            rules: { type: Array as PropType<Rule<T>[]>, default: () => [] },
            state: { type: String as PropType<UIState>, default: 'idle' },

            // v-model
            changed: { type: Boolean, default: false },
            valid: { type: Boolean, default: false },
        },
        excludes,
    );
}
