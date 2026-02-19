import { computed, ref, watch, type Ref } from 'vue';
import { objectUtil } from '@/utils';
import type { Item } from '../types';

export function useTableSelect(
    selectable: Ref<(item: Item, index?: number, items?: Item[]) => boolean>,
    items: Ref<Item[]>,
    initialSelectedItems: Ref<Item[]>,
) {
    const selectedItems = ref<Item[]>([...initialSelectedItems.value]);

    const anySelectable = computed<boolean>(() => {
        return items.value.some(selectable.value);
    });
    const selectableItems = computed<Item[]>(() => {
        return items.value.filter(selectable.value);
    });
    const selectedPartial = computed(() => {
        return selectedItems.value.length > 0 && selectedItems.value.length < selectableItems.value.length;
    });
    const selectedAll = computed(() => {
        const selectableLength = selectableItems.value.length;
        return selectableLength > 0 && selectedItems.value.length === selectableLength;
    });

    function toggleSelectAll(): void {
        if (selectedAll.value) {
            selectedItems.value = [];
            return;
        }
        selectedItems.value = [...selectableItems.value];
    }

    watch(initialSelectedItems, (next) => {
        const current = selectedItems.value;
        if (objectUtil.isEqual(current, next)) {
            return;
        }
        selectedItems.value = [...next];
    });

    return {
        selectedItems,
        selectedAll,
        selectedPartial,
        anySelectable,
        toggleSelectAll,
    };
}
