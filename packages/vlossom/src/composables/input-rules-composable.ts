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
    async function checkRules() {
        ruleMessages.value = [];
        const pendingRules: Promise<string>[] = [];

        computedRules.value.forEach((rule) => {
            const result = rule(inputValue.value);
            if (!result) {
                return;
            }
            if (result instanceof Promise) {
                pendingRules.push(result);
            } else {
                ruleMessages.value.push({ state: 'error', text: result as string });
            }
        });

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

        ruleMessages.value.push(...resolvedMessages);
    }
    watch(computedRules, checkRules, { deep: true });

    return { ruleMessages, checkRules };
}
