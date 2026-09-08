import { computed, reactive, shallowRef, watch, type Ref } from 'vue';
import type { VsTableItem } from './../types';

export function useTableSelect(
    selectable: Ref<(item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean>,
    items: Ref<VsTableItem[]>,
    initialSelectedItems: Ref<VsTableItem[]>,
) {
    const selectedItems = shallowRef<VsTableItem[]>([]);
    // 선택 여부를 Set으로 조회한다. reactive Set은 항목 단위로 의존성을 추적하므로 한 행을 선택해도 나머지 행은 다시 계산되지 않는다.
    const selectedSet = reactive(new Set<VsTableItem>());

    function setSelectedItems(next: VsTableItem[]): void {
        selectedItems.value = next;
        selectedSet.clear();
        next.forEach((item) => selectedSet.add(item));
    }

    setSelectedItems([...initialSelectedItems.value]);

    const anySelectable = computed<boolean>(() => {
        return items.value.some(selectable.value);
    });
    const selectableItems = computed<VsTableItem[]>(() => {
        return items.value.filter(selectable.value);
    });
    const selectedPartial = computed(() => {
        return selectedItems.value.length > 0 && selectedItems.value.length < selectableItems.value.length;
    });
    const selectedAll = computed(() => {
        const selectableLength = selectableItems.value.length;
        return selectableLength > 0 && selectedItems.value.length === selectableLength;
    });

    function isItemSelected(item: VsTableItem): boolean {
        return selectedSet.has(item);
    }

    function toggleSelect(item: VsTableItem): void {
        if (selectedSet.has(item)) {
            selectedSet.delete(item);
            selectedItems.value = selectedItems.value.filter((selected) => selected !== item);
            return;
        }
        selectedSet.add(item);
        selectedItems.value = [...selectedItems.value, item];
    }

    function toggleSelectAll(): void {
        setSelectedItems(selectedAll.value ? [] : [...selectableItems.value]);
    }

    watch(initialSelectedItems, (next) => {
        // 선택 여부는 객체 동일성으로 판정하므로, 내용이 같아도 새 객체라면
        // 내부 Set을 새 참조로 교체해야 행의 체크 표시와 동기화된다.
        if (
            selectedItems.value.length === next.length &&
            selectedItems.value.every((item, index) => item === next[index])
        ) {
            return;
        }
        setSelectedItems([...next]);
    });

    return {
        selectedItems,
        selectedAll,
        selectedPartial,
        anySelectable,
        isItemSelected,
        toggleSelect,
        toggleSelectAll,
    };
}
