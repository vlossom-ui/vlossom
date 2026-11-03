import { computed, ref, shallowRef, toRaw, watch, type Ref } from 'vue';
import { functionUtil } from '@/utils';
import type { VsTableItem } from './../types';

export function useTableSelectionComposable(
    rawSelectable: Ref<boolean | ((item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean)>,
    rawSelectedItems: Ref<VsTableItem[]>,
    items: Ref<VsTableItem[]>,
    visibleItems: Ref<VsTableItem[]>,
    getItemKey: (item: VsTableItem) => string | number,
    serverMode: Ref<boolean> = ref(false),
) {
    const isSelectable = computed(() =>
        functionUtil.toCallable<[VsTableItem, number?, VsTableItem[]?], boolean>(rawSelectable.value),
    );

    // server mode의 items는 현재 페이지뿐이므로 items에 없는 key의 선택은 지우지 않는다
    function reconcile(list: VsTableItem[]): VsTableItem[] {
        const itemsByKey = new Map(items.value.map((item) => [getItemKey(item), item]));
        return list.flatMap((selectedItem) => {
            const latestItem = itemsByKey.get(getItemKey(selectedItem));
            if (!latestItem) {
                return serverMode.value ? [selectedItem] : [];
            }
            return toRaw(latestItem) === toRaw(selectedItem) ? [selectedItem] : [latestItem];
        });
    }

    function isSameItems(a: VsTableItem[], b: VsTableItem[]): boolean {
        return a.length === b.length && a.every((item, index) => item === b[index]);
    }

    // 사용자 객체를 프록시로 감싸지 않은 채 그대로 emit하기 위해 shallowRef를 쓴다
    const selectedItems = shallowRef<VsTableItem[]>(reconcile(rawSelectedItems.value));
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

    // splice 같은 제자리 변경도 잡도록 배열 원소까지만 추적한다
    watch(
        items,
        () => {
            const current = selectedItems.value;
            if (!current.length) {
                return;
            }
            const next = reconcile(current);
            if (!isSameItems(next, current)) {
                selectedItems.value = next;
            }
        },
        { deep: 1 },
    );

    // 정리된 결과가 입력과 다르면 내부 값이 그대로여도 다시 할당해 부모의 v-model을 맞춘다
    watch(rawSelectedItems, (nextSelectedItems) => {
        const next = reconcile(nextSelectedItems);
        if (isSameItems(next, nextSelectedItems) && isSameItems(next, selectedItems.value)) {
            return;
        }
        selectedItems.value = next;
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
        isSameItems,
    };
}
