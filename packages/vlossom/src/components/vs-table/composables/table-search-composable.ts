import { computed, type ComputedRef, type Ref } from 'vue';
import type { VsSearchInputRef } from '@/components';
import { objectUtil } from '@/utils';
import { type VsTableColumnDef, type VsTableRow } from './../types';

export function useTableSearch(ref: Ref<VsSearchInputRef | null>, columns: ComputedRef<VsTableColumnDef[] | null>) {
    const skipKeyList = computed<string[]>(() => {
        if (!columns.value) {
            return [];
        }
        return columns.value.filter((col) => col.skipSearch).map((column) => column.key);
    });

    function matchBySearch(row: VsTableRow): boolean {
        if (!ref.value) {
            return true;
        }
        const item = row.item;
        if (!item) {
            return false;
        }
        const brushedItem = objectUtil.omit(item, skipKeyList.value);
        const crushedItem = objectUtil.crush(brushedItem);
        const search = ref.value.match;

        const flattenedItemText = Object.values(crushedItem).join(' ');
        return search(flattenedItemText);
    }

    return {
        matchBySearch,
    };
}
