import { watch, type Ref } from 'vue';

export function useIndexModelSync(
    modelValue: Ref<number>,
    selectedIndex: Ref<number>,
    syncIndex: (index: number) => void,
    onChange: (index: number) => void,
) {
    watch(modelValue, syncIndex, { immediate: true });

    /**
     * NOTE
     * 1. modelValue watcher보다 뒤에 등록해야 보정 전 값을 emit하지 않는다.
     * 2. 보정 결과가 직전 선택과 같으면 selectedIndex가 바뀌지 않으므로 modelValue와도 비교한다.
     */
    watch(
        [selectedIndex, modelValue],
        ([index, model], [prevIndex]) => {
            const isChanged = prevIndex !== undefined && index !== prevIndex;
            if (index === model && !isChanged) {
                return;
            }
            onChange(index);
        },
        { immediate: true },
    );
}
