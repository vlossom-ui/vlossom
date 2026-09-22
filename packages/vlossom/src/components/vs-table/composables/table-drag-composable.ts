import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';
import type { VsTableItem } from './../types';

export function useTableDragComposable(sortedItems: ComputedRef<VsTableItem[]>, items: Ref<VsTableItem[]>) {
    const dragOrder = ref<VsTableItem[] | null>(null);

    const viewItems = computed<VsTableItem[]>(() => dragOrder.value ?? sortedItems.value);

    // 드래그는 화면에 보이는 순서(정렬 결과 포함)를 다시 배열한다. 페이지네이션이 있으면 그 페이지가 차지한 자리 안에서만 바뀐다.
    function setDragOrder(nextItems: VsTableItem[], startIndex: number): void {
        const reordered = [...viewItems.value];
        reordered.splice(startIndex, nextItems.length, ...nextItems);
        dragOrder.value = reordered;
    }

    // 아이템/검색/정렬이 바뀌면 드래그로 만든 순서의 기준이 사라지므로 버린다
    watch([sortedItems, () => items.value.length], () => {
        dragOrder.value = null;
    });

    return { viewItems, setDragOrder };
}
