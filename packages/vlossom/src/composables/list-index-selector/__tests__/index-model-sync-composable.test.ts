import { describe, it, expect, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useIndexSelector } from './../list-index-selector-composable';
import { useIndexModelSync } from './../index-model-sync-composable';

function setup(items: string[], initialModel: number) {
    const list = ref(items);
    const modelValue = ref(initialModel);
    const onChange = vi.fn();
    const { selectedIndex, selectIndex, syncIndex } = useIndexSelector(list);
    useIndexModelSync(modelValue, selectedIndex, syncIndex, onChange);
    return { list, modelValue, onChange, selectedIndex, selectIndex };
}

describe('index-model-sync-composable', () => {
    it('처음 modelValue가 유효하면 알리지 않아야 한다', () => {
        // given, when
        const { onChange, selectedIndex } = setup(['a', 'b', 'c'], 2);

        // then
        expect(selectedIndex.value).toBe(2);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('처음 modelValue를 보정하면 보정한 값을 알려야 한다', () => {
        // given, when
        const { onChange, selectedIndex } = setup(['a', 'b', 'c'], 5);

        // then
        expect(selectedIndex.value).toBe(2);
        expect(onChange.mock.calls).toEqual([[2]]);
    });

    it('처음 보정한 값이 초기 selectedIndex(0)와 같아도 알려야 한다', () => {
        // given, when
        const { onChange } = setup(['a'], 3);

        // then
        expect(onChange.mock.calls).toEqual([[0]]);
    });

    it('부모가 유효한 값으로 바꾸면 이전 값을 알리지 않아야 한다', async () => {
        // given
        const { modelValue, onChange } = setup(['a', 'b', 'c', 'd'], 0);

        // when
        modelValue.value = 3;
        await nextTick();

        // then
        expect(onChange.mock.calls.flat()).not.toContain(0);
    });

    it('부모가 범위 밖 값을 주면 보정한 값이 현재 선택과 같아도 알려야 한다', async () => {
        // given
        const { modelValue, onChange } = setup(['a', 'b', 'c'], 2);

        // when
        modelValue.value = 5;
        await nextTick();

        // then
        expect(onChange.mock.calls).toEqual([[2]]);
    });

    it('부모가 값을 받지 않아도 사용자가 modelValue와 같은 항목으로 돌아가면 알려야 한다', async () => {
        // given
        const { onChange, selectIndex } = setup(['a', 'b', 'c'], 0);

        // when
        selectIndex(2);
        await nextTick();
        selectIndex(0);
        await nextTick();

        // then
        expect(onChange.mock.calls).toEqual([[2], [0]]);
    });

    it('부모가 알린 값을 받으면 다시 알리지 않아야 한다', async () => {
        // given
        const { modelValue, onChange, selectIndex } = setup(['a', 'b', 'c'], 0);

        // when
        selectIndex(1);
        await nextTick();
        modelValue.value = 1;
        await nextTick();

        // then
        expect(onChange.mock.calls).toEqual([[1]]);
    });
});
