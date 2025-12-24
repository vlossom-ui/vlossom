import { computed, ref, type Ref } from 'vue';
import { isBodyRow, getRowId, getRowItem, type Item, type Cell } from '../types';

export function useTableExpand(
    expandable: Ref<(item: Item, index?: number, items?: Item[]) => boolean>,
    items: Ref<Item[]>,
) {
    const expanded = ref<Set<string>>(new Set());

    const anyExpandable = computed<boolean>(() => {
        return items.value.some(expandable.value);
    });

    function isExpanded(row: Cell[]): boolean {
        if (!isBodyRow(row)) {
            return false;
        }
        const rowId = getRowId(row);
        if (!rowId) {
            return false;
        }
        return expanded.value.has(rowId);
    }

    function toggleExpand(row: Cell[]): boolean {
        if (!isBodyRow(row)) {
            return false;
        }
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
