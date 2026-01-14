import { computed, ref, watch, type Ref } from 'vue';
import { objectUtil } from '@/utils';
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
        return selectedIds.value.length === selectableItems.value.length;
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
            const sortedNextIds = [...nextIds].sort();
            const sortedCurrentIds = [...currentIds].sort();

            if (objectUtil.isEqual(sortedNextIds, sortedCurrentIds)) {
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
