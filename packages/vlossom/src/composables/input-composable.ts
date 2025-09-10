import {
    type ComputedRef,
    type Ref,
    computed,
    nextTick,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    onUnmounted,
    ref,
    watch,
    useId,
} from 'vue';
import type { Message, Rule, StateMessage, UIState } from '@/declaration';
import { useInputForm } from './input-form-composable';
import { useInputMessages } from './input-messages-composable';
import { useInputRule } from './input-rule-composable';

export interface InputComponentParams<T = unknown> {
    inputValue: Ref<T>;
    modelValue: Ref<T>;
    id?: Ref<string>;
    disabled?: Ref<boolean>;
    readonly?: Ref<boolean>;
    messages?: Ref<Message<T>[]>;
    rules?: Ref<Rule<T>[]>;
    defaultRules?: Rule<T>[];
    noDefaultRules?: Ref<boolean>;
    state?: Ref<UIState>;
    callbacks?: {
        onBeforeMount?: () => void;
        onMounted?: () => void;
        onChange?: (newValue: T, oldValue: T) => void;
        onClear?: () => void;
        onBeforeUnmount?: () => void;
        onUnmounted?: () => void;
    };
}

export function useInput<T = unknown>(ctx: any, inputParams: InputComponentParams<T>) {
    const { emit } = ctx;
    const {
        inputValue,
        modelValue,
        id = ref(''),
        disabled = ref(false),
        readonly = ref(false),
        messages = ref([]),
        rules = ref([]),
        defaultRules = [],
        noDefaultRules = ref(false),
        state = ref('idle'),
        callbacks = {},
    } = inputParams;

    const innerId = useId();
    const computedId = computed(() => id.value || innerId);

    const changed = ref(false);
    const isInitialized = ref(false);

    const { innerMessages, checkMessages } = useInputMessages(inputValue, messages);

    const { ruleMessages, checkRules } = useInputRule(inputValue, rules, defaultRules, noDefaultRules);

    const showRuleMessages = ref(false);

    const computedMessages: ComputedRef<StateMessage[]> = computed(() => {
        if (showRuleMessages.value) {
            return [...innerMessages.value, ...ruleMessages.value];
        }

        return innerMessages.value;
    });

    watch(
        inputValue,
        (value, oldValue) => {
            emit('update:modelValue', value);
            if (callbacks.onChange) {
                callbacks.onChange(value, oldValue);
            }

            checkMessages();
            checkRules();

            if (!isInitialized.value) {
                return;
            }
            changed.value = true;
            showRuleMessages.value = true;
            emit('change', value);
        },
        { deep: true },
    );

    watch(
        modelValue,
        (value) => {
            if (value === inputValue.value) {
                return;
            }
            inputValue.value = value;
        },
        { deep: true },
    );

    const valid = computed(() => ruleMessages.value.length === 0);
    watch(valid, () => {
        emit('update:valid', valid.value);
    });

    onBeforeMount(() => {
        if (callbacks.onBeforeMount) {
            callbacks.onBeforeMount();
        }
    });

    onMounted(() => {
        if (callbacks.onMounted) {
            callbacks.onMounted();
        }

        checkMessages();
        checkRules();

        nextTick(() => {
            isInitialized.value = true;
        });
    });

    onBeforeUnmount(() => {
        if (callbacks.onBeforeUnmount) {
            callbacks.onBeforeUnmount();
        }
    });

    onUnmounted(() => {
        if (callbacks.onUnmounted) {
            callbacks.onUnmounted();
        }
    });

    const shake = ref(false);
    function validate(): boolean {
        showRuleMessages.value = true;
        if (!valid.value) {
            shake.value = !shake.value;
        }
        return valid.value;
    }

    function clear() {
        if (callbacks.onClear) {
            callbacks.onClear();
        }

        nextTick(() => {
            checkMessages();
            checkRules();
            showRuleMessages.value = false;
            changed.value = false;
        });
    }

    const { formDisabled, formReadonly } = useInputForm(computedId, valid, changed, validate, clear);

    const computedDisabled = computed(() => disabled.value || formDisabled.value);

    const computedReadonly = computed(() => readonly.value || formReadonly.value);

    watch(changed, () => {
        emit('update:changed', changed.value);
    });

    const computedState = computed(() => (showRuleMessages.value && !valid.value ? 'error' : state.value));

    return {
        changed,
        valid,
        shake,
        computedMessages,
        showRuleMessages,
        validate,
        clear,
        computedId,
        computedDisabled,
        computedReadonly,
        computedState,
    };
}
