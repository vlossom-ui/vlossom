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
    let latestCheck: Promise<void> = Promise.resolve();
    function checkRules() {
        latestCheck = runRules();
        return latestCheck;
    }

    // resolves once the latest check (including any started while waiting) has finished
    async function waitRules() {
        let check: Promise<void>;
        do {
            check = latestCheck;
            await check;
        } while (check !== latestCheck);
    }

    async function runRules() {
        const id = ++checkId;
        const syncMessages: StateMessage[] = [];
        const pendingRules: PromiseLike<string>[] = [];

        computedRules.value.forEach((rule) => {
            const result = rule(inputValue.value);
            if (!result) {
                return;
            }
            if (typeof (result as PromiseLike<string>).then === 'function') {
                pendingRules.push(result as PromiseLike<string>);
            } else {
                syncMessages.push({ state: 'error', text: result as string });
            }
        });

        ruleMessages.value = syncMessages;
        if (pendingRules.length === 0) {
            return;
        }

        const resolved = await Promise.all(pendingRules);
        // drop results of outdated calls (value or rules changed while pending)
        if (id !== checkId) {
            return;
        }
        const asyncMessages: StateMessage[] = resolved.filter(Boolean).map((text) => ({ state: 'error', text }));
        ruleMessages.value = [...syncMessages, ...asyncMessages];
    }
    watch(computedRules, checkRules, { deep: true });

    return { ruleMessages, checkRules, waitRules };
}
