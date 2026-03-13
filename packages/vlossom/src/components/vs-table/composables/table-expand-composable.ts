import { computed, reactive, type Ref } from 'vue';
import { isVsTableBodyRow, getRowId, getRowItem, type VsTableItem, type VsTableCell } from '../types';

export function useTableExpand(
    expandable: Ref<(item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean>,
    items: Ref<VsTableItem[]>,
) {
    const expanded = reactive(new Set());

    const anyExpandable = computed<boolean>(() => {
        return items.value.some(expandable.value);
    });

    function isExpanded(row: VsTableCell[]): boolean {
        if (!isVsTableBodyRow(row)) {
            return false;
        }
        const rowId = getRowId(row);
        if (!rowId) {
            return false;
        }
        return expanded.has(rowId);
    }

    function toggleExpand(row: VsTableCell[]): boolean {
        if (!isVsTableBodyRow(row)) {
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

        if (expanded.has(rowId)) {
            expanded.delete(rowId);
        } else {
            expanded.add(rowId);
        }
        return expanded.has(rowId);
    }

    return {
        anyExpandable,
        isExpanded,
        toggleExpand,
    };
}
