import { computed, ref, watch, type Ref } from 'vue';
import type { Item } from '../types';

export function useTableSelect(
    selectable: Ref<(item: Item, index?: number, items?: Item[]) => boolean>,
    items: Ref<Item[]>,
    initialSelectedItems: Ref<Item[]>,
) {
    const selectedIds = ref<string[]>(initialSelectedItems.value.map((item) => item.id!));

    const anySelectable = computed<boolean>(() => {
        return items.value.some(selectable.value);
    });
    const selectableItems = computed<Item[]>(() => {
        return items.value.filter(selectable.value);
    });
    const selectedPartial = computed(() => {
        return selectedIds.value.length > 0 && selectedIds.value.length < selectableItems.value.length;
    });
    const selectedAll = computed(() => {
        const selectableLength = selectableItems.value.length;
        // 선택 가능한 항목이 없으면 false 반환 (빈 테이블 처리)
        return selectableLength > 0 && selectedIds.value.length === selectableLength;
    });

    function toggleSelectAll(): void {
        if (selectedAll.value) {
            selectedIds.value = [];
            return;
        }
        selectedIds.value = selectableItems.value.map((item) => item.id!);
    }

    watch(initialSelectedItems, (next) => {
        const nextIds = next.map((item) => item.id!);
        const currentIds = selectedIds.value;

        if (nextIds.length === currentIds.length) {
            // O(n) Set 비교: 정렬보다 효율적
            const currentIdSet = new Set(currentIds);
            const allMatch = nextIds.every((id) => currentIdSet.has(id));

            if (allMatch) {
                return;
            }
        }

        selectedIds.value = nextIds;
    });

    return {
        selectedIds,
        selectedAll,
        selectedPartial,
        anySelectable,
        toggleSelectAll,
    };
}
