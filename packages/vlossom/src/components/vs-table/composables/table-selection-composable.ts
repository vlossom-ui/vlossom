import { computed, ref, watch, type Ref } from 'vue';
import { functionUtil } from '@/utils';
import type { VsTableItem } from './../types';

export function useTableSelectionComposable(
    rawSelectable: Ref<boolean | ((item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean)>,
    rawSelectedItems: Ref<VsTableItem[]>,
    items: Ref<VsTableItem[]>,
    getItemKey: (item: VsTableItem) => string | number,
) {
    const isSelectable = computed(() =>
        functionUtil.toCallable<[VsTableItem, number?, VsTableItem[]?], boolean>(rawSelectable.value),
    );

    const selectedItems = ref<VsTableItem[]>([...rawSelectedItems.value]);
    const selectedKeys = computed(() => new Set(selectedItems.value.map(getItemKey)));

    // selectable이 boolean이면 아이템을 순회하지 않는다 (대량 items에서는 갱신마다 전체 스캔이 된다)
    const selectableCount = computed<number>(() => {
        if (typeof rawSelectable.value === 'boolean') {
            return rawSelectable.value ? items.value.length : 0;
        }
        return items.value.filter(isSelectable.value).length;
    });

    const anySelectable = computed<boolean>(() => selectableCount.value > 0);
    const selectedAll = computed<boolean>(
        () => selectableCount.value > 0 && selectedItems.value.length === selectableCount.value,
    );
    const selectedPartial = computed<boolean>(
        () => selectedItems.value.length > 0 && selectedItems.value.length < selectableCount.value,
    );

    function isSelected(item: VsTableItem): boolean {
        return selectedKeys.value.has(getItemKey(item));
    }

    function selectItem(item: VsTableItem, index: number, selected: boolean): boolean {
        if (!isSelectable.value(item, index, items.value)) {
            return false;
        }

        const key = getItemKey(item);
        const rest = selectedItems.value.filter((selectedItem) => getItemKey(selectedItem) !== key);
        selectedItems.value = selected ? [...rest, item] : rest;
        return true;
    }

    function selectAll(selected: boolean): void {
        selectedItems.value = selected ? items.value.filter(isSelectable.value) : [];
    }

    watch(rawSelectedItems, (nextSelectedItems) => {
        const current = selectedItems.value;
        if (
            nextSelectedItems.length === current.length &&
            nextSelectedItems.every((item, index) => item === current[index])
        ) {
            return;
        }
        selectedItems.value = [...nextSelectedItems];
    });

    return {
        isSelectable,
        selectedItems,
        anySelectable,
        selectedAll,
        selectedPartial,
        isSelected,
        selectItem,
        selectAll,
    };
}
