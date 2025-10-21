import { computed, type ComputedRef, ref, type Ref, watch } from 'vue';
import type { Message, StateMessage, UIState } from '@/declaration';

export function useInputMessages<T>(
    inputValue: Ref<T>,
    messages: Ref<Message<T>[]>,
    ruleMessages: Ref<StateMessage<Exclude<UIState, 'selected'>>[]>,
) {
    const innerMessages: Ref<StateMessage<Exclude<UIState, 'selected'>>[]> = ref([]);
    const showRuleMessages = ref(false);

    async function checkMessages() {
        innerMessages.value = [];
        const pendingMessages: Promise<StateMessage<Exclude<UIState, 'selected'>>>[] = [];

        messages.value.forEach((message) => {
            if (typeof message === 'function') {
                const result = message(inputValue.value);
                if (result instanceof Promise) {
                    pendingMessages.push(result);
                } else {
                    innerMessages.value.push(result as StateMessage<Exclude<UIState, 'selected'>>);
                }
            } else {
                innerMessages.value.push(message as StateMessage<Exclude<UIState, 'selected'>>);
            }
        });

        if (pendingMessages.length === 0) {
            return;
        }
        const resolvedMessages = await Promise.all(pendingMessages);
        innerMessages.value.push(...resolvedMessages);
    }

    watch(messages, checkMessages, { deep: true });

    const computedMessages: ComputedRef<StateMessage<Exclude<UIState, 'selected'>>[]> = computed(() => {
        if (showRuleMessages.value) {
            return [...innerMessages.value, ...ruleMessages.value];
        }

        return innerMessages.value;
    });

    return { showRuleMessages, computedMessages, checkMessages };
}
