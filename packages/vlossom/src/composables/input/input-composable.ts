import { computed, nextTick, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, ref, watch } from 'vue';
import type { InputComponentParams } from '@/declaration';
import { useInputForm } from '@/composables/input-form/input-form-composable';
import { useInputMessages } from '@/composables/input-messages/input-messages-composable';
import { useInputRules } from '@/composables/input-rules/input-rules-composable';
import { objectUtil, stringUtil } from '@/utils';

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
        defaultRules = ref([]),
        noDefaultRules = ref(false),
        state = ref('idle'),
        callbacks = {},
    } = inputParams;

    const innerId = `vs-input-${stringUtil.createID()}`;
    const computedId = computed(() => id.value || innerId);

    const changed = ref(false);
    const isInitialized = ref(false);

    const { ruleMessages, checkRules } = useInputRules<T>(inputValue, rules, defaultRules, noDefaultRules);

    const { computedMessages, checkMessages, showRuleMessages } = useInputMessages(inputValue, messages, ruleMessages);

    watch(
        inputValue,
        (value, oldValue) => {
            if (objectUtil.isEqual(value, oldValue)) {
                return;
            }

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
            if (objectUtil.isEqual(value, inputValue.value)) {
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
