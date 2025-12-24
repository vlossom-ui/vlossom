import { computed, ref, type Ref } from 'vue';
import { type BodyCell, getRowId, getRowItem, type Item } from '../types';

export function useTableExpand(
    expandable: Ref<(item: Item, index?: number, items?: Item[]) => boolean>,
    items: Ref<Item[]>,
) {
    const expanded = ref<Set<string>>(new Set());

    const anyExpandable = computed<boolean>(() => {
        return items.value.some(expandable.value);
    });

    function isExpanded(row: BodyCell[]): boolean {
        const rowId = getRowId(row);
        if (!rowId) {
            return false;
        }
        return expanded.value.has(rowId);
    }

    function toggleExpand(row: BodyCell[]): boolean {
        const rowItem = getRowItem(row);
        if (!rowItem) {
            return false;
        }
        const rowId = getRowId(row);
        if (!rowId) {
            return false;
        }
        const rowIdx = row[0]?.rowIdx;
        if (!expandable.value(rowItem, rowIdx, items.value)) {
            return false;
        }

        if (expanded.value.has(rowId)) {
            expanded.value.delete(rowId);
        } else {
            expanded.value.add(rowId);
        }
        return expanded.value.has(rowId);
    }

    return {
        anyExpandable,
        isExpanded,
        toggleExpand,
    };
}
