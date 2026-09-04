import { ref, type Ref, computed, getCurrentInstance, onMounted, watchEffect } from 'vue';
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

    let latestRun = 0;

    async function checkRules() {
        const currentRun = ++latestRun;

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

        if (currentRun !== latestRun) {
            return;
        }

        ruleMessages.value = [...syncMessages, ...resolvedMessages];
    }

    // 규칙 함수가 내부에서 읽는 반응형 값(required, min, max, 클로저 상태 등)까지 추적해야 하므로
    // 규칙 배열만 감시하지 않고 규칙 실행 자체를 effect 안에서 수행한다.
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
        checkRules();
    });

    return { ruleMessages, checkRules };
}
