import { ref, type Ref, computed, watch } from 'vue';
import type { Rule, StateMessage } from '@/declaration';

export function useInputRules<T>(
    inputValue: Ref<T>,
    rules: Ref<Rule<T>[]>,
    defaultRules: Ref<Rule<T>[]>,
    noDefaultRules: Ref<boolean>,
) {
    const computedRules = computed(() => {
        if (noDefaultRules.value) {
            return rules.value;
        }

        return [...defaultRules.value, ...rules.value];
    });

    const ruleMessages: Ref<StateMessage[]> = ref([]);
    let checkId = 0;
    async function checkRules() {
        const currentCheckId = ++checkId;
        const syncMessages: StateMessage[] = [];
        const pendingRules: Promise<string>[] = [];

        computedRules.value.forEach((rule) => {
            const result = rule(inputValue.value);
            if (!result) {
                return;
            }
            if (result instanceof Promise) {
                pendingRules.push(result);
            } else {
                syncMessages.push({ state: 'error', text: result as string });
            }
        });

        // async rule을 기다리는 동안에도 sync rule 결과는 바로 보여야 한다
        ruleMessages.value = syncMessages;
        if (pendingRules.length === 0) {
            return;
        }
        const resolvedMessages = (await Promise.all(pendingRules)).reduce((acc: StateMessage[], resolved) => {
            if (resolved) {
                acc.push({
                    state: 'error',
                    text: resolved,
                });
            }

            return acc;
        }, []);

        // 늦게 끝난 이전 호출의 결과가 최신 값의 검증 결과를 덮어쓰지 않게 한다
        if (currentCheckId !== checkId) {
            return;
        }
        ruleMessages.value = [...syncMessages, ...resolvedMessages];
    }
    watch(computedRules, checkRules, { deep: true });

    return { ruleMessages, checkRules };
}
