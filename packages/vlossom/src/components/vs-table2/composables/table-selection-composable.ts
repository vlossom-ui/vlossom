import { computed, ref, watch, type Ref } from 'vue';
import { functionUtil } from '@/utils';
import type { VsTable2Item } from './../types';

export function useTableSelectionComposable(
    rawSelectable: Ref<boolean | ((item: VsTable2Item, index?: number, items?: VsTable2Item[]) => boolean)>,
    rawSelectedItems: Ref<VsTable2Item[]>,
    items: Ref<VsTable2Item[]>,
    getItemKey: (item: VsTable2Item) => string | number,
) {
    const isSelectable = computed(() =>
        functionUtil.toCallable<[VsTable2Item, number?, VsTable2Item[]?], boolean>(rawSelectable.value),
    );

    const selectedItems = ref<VsTable2Item[]>([...rawSelectedItems.value]);
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

    function isSelected(item: VsTable2Item): boolean {
        return selectedKeys.value.has(getItemKey(item));
    }

    function selectItem(item: VsTable2Item, index: number, selected: boolean): boolean {
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
