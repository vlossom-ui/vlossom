import { computed, ref, type Ref } from 'vue';
import type { Item } from '../types';

export function useTableSelect(
    selectable: Ref<(item: Item, index?: number, items?: Item[]) => boolean>,
    items: Ref<Item[]>,
) {
    const selectedIds = ref<string[]>([]);

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
        return selectedIds.value.length === selectableItems.value.length;
    });

    function toggleSelectAll(): void {
        if (selectedAll.value) {
            selectedIds.value = [];
            return;
        }
        selectedIds.value = selectableItems.value.map((item) => item.id!);
    }

    return {
        selectedIds,
        selectedAll,
        selectedPartial,
        anySelectable,
        toggleSelectAll,
    };
}
