import type { PropType } from 'vue';
import type { Message, Rule, UIState } from '@/declaration';
import { objectUtil } from '@/utils';

interface InputPropsDefinition {
    disabled: { type: typeof Boolean; default: boolean };
    hidden: { type: typeof Boolean; default: boolean };
    id: { type: typeof String; default: string };
    label: { type: typeof String; default: string };
    messages: { type: PropType<Message<any>[]>; default: () => Message<any>[] };
    name: { type: typeof String; default: string };
    noDefaultRules: { type: typeof Boolean; default: boolean };
    noMessages: { type: typeof Boolean; default: boolean };
    placeholder: { type: typeof String; default: string };
    readonly: { type: typeof Boolean; default: boolean };
    required: { type: typeof Boolean; default: boolean };
    rules: { type: PropType<Rule<any>[]>; default: () => Rule<any>[] };
    small: { type: typeof Boolean; default: boolean };
    state: { type: PropType<UIState>; default: UIState };

    changed: { type: typeof Boolean; default: boolean };
    valid: { type: typeof Boolean; default: boolean };
}

export function getInputProps<T = unknown, K extends keyof InputPropsDefinition = never>(
    ...excludes: K[]
): Omit<InputPropsDefinition, K> {
    return objectUtil.omit(
        {
            disabled: { type: Boolean, default: false },
            hidden: { type: Boolean, default: false },
            id: { type: String, default: '' },
            label: { type: String, default: '' },
            messages: { type: Array as PropType<Message<T>[]>, default: () => [] },
            name: { type: String, default: '' },
            noDefaultRules: { type: Boolean, default: false },
            noMessages: { type: Boolean, default: false },
            placeholder: { type: String, default: '' },
            readonly: { type: Boolean, default: false },
            required: { type: Boolean, default: false },
            rules: { type: Array as PropType<Rule<T>[]>, default: () => [] },
            small: { type: Boolean, default: false },
            state: { type: String as PropType<UIState>, default: 'idle' },

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
