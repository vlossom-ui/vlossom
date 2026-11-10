import { computed, type ComputedRef, ref, type Ref, watch } from 'vue';
import type { Message, StateMessage } from '@/declaration';

export function useInputMessages<T>(
    inputValue: Ref<T>,
    messages: Ref<Message<T>[]>,
    ruleMessages: Ref<StateMessage[]>,
) {
    const innerMessages: Ref<StateMessage[]> = ref([]);
    const showRuleMessages = ref(false);

    let checkId = 0;
    async function checkMessages() {
        const id = ++checkId;
        const syncMessages: StateMessage[] = [];
        const pendingMessages: PromiseLike<StateMessage>[] = [];

        messages.value.forEach((message) => {
            if (typeof message !== 'function') {
                syncMessages.push(message);
                return;
            }
            const result = message(inputValue.value) as StateMessage | PromiseLike<StateMessage>;
            if (typeof (result as PromiseLike<StateMessage>)?.then === 'function') {
                pendingMessages.push(result as PromiseLike<StateMessage>);
            } else {
                syncMessages.push(result as StateMessage);
            }
        });

        innerMessages.value = syncMessages;
        if (pendingMessages.length === 0) {
            return;
        }

        const resolvedMessages = await Promise.all(pendingMessages);
        // drop results of outdated calls (value or messages changed while pending)
        if (id !== checkId) {
            return;
        }
        innerMessages.value = [...syncMessages, ...resolvedMessages];
    }

    watch(messages, checkMessages, { deep: true });

    const computedMessages: ComputedRef<StateMessage[]> = computed(() => {
        if (showRuleMessages.value) {
            return [...innerMessages.value, ...ruleMessages.value];
        }

        return innerMessages.value;
    });

    return { showRuleMessages, computedMessages, checkMessages };
}
