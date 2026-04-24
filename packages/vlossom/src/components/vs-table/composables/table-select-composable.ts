import { computed, ref, watch, type Ref } from 'vue';
import { objectUtil } from '@/utils';
import type { VsTableItem } from './../types';

export function useTableSelect(
    selectable: Ref<(item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean>,
    items: Ref<VsTableItem[]>,
    initialSelectedItems: Ref<VsTableItem[]>,
) {
    const selectedItems = ref<VsTableItem[]>([...initialSelectedItems.value]);

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
