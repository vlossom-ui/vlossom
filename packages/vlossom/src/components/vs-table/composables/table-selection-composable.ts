import { computed, shallowRef, toRaw, watch, type Ref } from 'vue';
import { functionUtil } from '@/utils';
import type { VsTableItem } from './../types';

export function useTableSelectionComposable(
    rawSelectable: Ref<boolean | ((item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean)>,
    rawSelectedItems: Ref<VsTableItem[]>,
    items: Ref<VsTableItem[]>,
    visibleItems: Ref<VsTableItem[]>,
    getItemKey: (item: VsTableItem) => string | number,
) {
    const isSelectable = computed(() =>
        functionUtil.toCallable<[VsTableItem, number?, VsTableItem[]?], boolean>(rawSelectable.value),
    );

    // 사용자 객체를 프록시로 감싸지 않은 채 그대로 emit하기 위해 shallowRef를 쓴다
    const selectedItems = shallowRef<VsTableItem[]>([...rawSelectedItems.value]);
    const selectedKeys = computed(() => new Set(selectedItems.value.map(getItemKey)));

    // selectable이 boolean이면 아이템을 순회하지 않는다 (대량 items에서는 갱신마다 전체 스캔이 된다)
    function filterSelectable(list: VsTableItem[]): VsTableItem[] {
        if (typeof rawSelectable.value === 'boolean') {
            return rawSelectable.value ? list : [];
        }
        return list.filter((item, index) => isSelectable.value(item, index, list));
    }

    const anySelectable = computed<boolean>(() => filterSelectable(items.value).length > 0);
    const selectableVisibleItems = computed<VsTableItem[]>(() => filterSelectable(visibleItems.value));

    const selectedAll = computed<boolean>(
        () => selectableVisibleItems.value.length > 0 && selectableVisibleItems.value.every(isSelected),
    );
    const selectedPartial = computed<boolean>(
        () => !selectedAll.value && selectableVisibleItems.value.some(isSelected),
    );

    function isSelected(item: VsTableItem): boolean {
        return selectedKeys.value.has(getItemKey(item));
    }

    function selectItem(item: VsTableItem, index: number, selected: boolean): boolean {
        if (!isSelectable.value(item, index, visibleItems.value)) {
            return false;
        }

        const key = getItemKey(item);
        const rest = selectedItems.value.filter((selectedItem) => getItemKey(selectedItem) !== key);
        selectedItems.value = selected ? [...rest, item] : rest;
        return true;
    }

    function selectAll(selected: boolean): void {
        const visibleKeys = new Set(visibleItems.value.map(getItemKey));
        const rest = selectedItems.value.filter((selectedItem) => !visibleKeys.has(getItemKey(selectedItem)));
        selectedItems.value = selected ? [...rest, ...selectableVisibleItems.value] : rest;
    }

    // server mode의 items는 현재 페이지뿐이므로 items에 없는 key의 선택은 지우지 않는다
    watch(items, (nextItems) => {
        if (!selectedItems.value.length) {
            return;
        }
        const itemsByKey = new Map(nextItems.map((item) => [getItemKey(item), item]));
        let changed = false;
        const nextSelectedItems = selectedItems.value.map((selectedItem) => {
            const latestItem = itemsByKey.get(getItemKey(selectedItem));
            if (!latestItem || toRaw(latestItem) === toRaw(selectedItem)) {
                return selectedItem;
            }
            changed = true;
            return latestItem;
        });
        if (changed) {
            selectedItems.value = nextSelectedItems;
        }
    });

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
