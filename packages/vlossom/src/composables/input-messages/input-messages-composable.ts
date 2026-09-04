import { computed, type ComputedRef, getCurrentInstance, onMounted, ref, type Ref, watchEffect } from 'vue';
import type { Message, StateMessage } from '@/declaration';

export function useInputMessages<T>(
    inputValue: Ref<T>,
    messages: Ref<Message<T>[]>,
    ruleMessages: Ref<StateMessage[]>,
) {
    const innerMessages: Ref<StateMessage[]> = ref([]);
    const showRuleMessages = ref(false);

    let latestRun = 0;

    async function checkMessages() {
        const currentRun = ++latestRun;

        const syncMessages: StateMessage[] = [];
        const pendingMessages: Promise<StateMessage>[] = [];

        messages.value.forEach((message) => {
            if (typeof message === 'function') {
                const result = message(inputValue.value);
                if (result instanceof Promise) {
                    pendingMessages.push(result);
                } else {
                    syncMessages.push(result as StateMessage);
                }
            } else {
                syncMessages.push(message);
            }
        });

        innerMessages.value = syncMessages;

        if (pendingMessages.length === 0) {
            return;
        }
        const resolvedMessages = await Promise.all(pendingMessages);

        if (currentRun !== latestRun) {
            return;
        }

        innerMessages.value = [...syncMessages, ...resolvedMessages];
    }

    // 메시지 함수가 내부에서 읽는 반응형 값까지 추적해야 하므로 메시지 배열만 감시하지 않고
    // 메시지 실행 자체를 effect 안에서 수행한다.
    // 단, 컴포넌트들이 마운트 시점에 inputValue를 정규화하므로 첫 실행은 마운트 이후로 미룬다.
    const instance = getCurrentInstance();
    const tracking = ref(!instance);
    if (instance) {
        onMounted(() => {
            tracking.value = true;
        });
    }

    watchEffect(() => {
        if (!tracking.value) {
            return;
        }
        checkMessages();
    });

    const computedMessages: ComputedRef<StateMessage[]> = computed(() => {
        if (showRuleMessages.value) {
            return [...innerMessages.value, ...ruleMessages.value];
        }

        return innerMessages.value;
    });

    return { showRuleMessages, computedMessages, checkMessages };
}
