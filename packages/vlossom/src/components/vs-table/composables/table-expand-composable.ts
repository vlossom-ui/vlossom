import { computed, reactive, type Ref } from 'vue';
import { type VsTableItem, type VsTableCell } from './../types';
import { isVsTableBodyRow, getRowId, getRowItem } from './../models/table-model';

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
        const rowId = getExpandableRowId(row);
        if (!rowId) {
            return false;
        }

        if (expanded.has(rowId)) {
            expanded.delete(rowId);
        } else {
            expanded.add(rowId);
        }
        return expanded.has(rowId);
    }

    function setExpand(row: VsTableCell[], shouldExpand: boolean): boolean {
        const rowId = getExpandableRowId(row);
        if (!rowId) {
            return false;
        }

        if (shouldExpand) {
            expanded.add(rowId);
        } else {
            expanded.delete(rowId);
        }
        return expanded.has(rowId);
    }

    // returns the row id only when the row is a valid, expandable body row
    function getExpandableRowId(row: VsTableCell[]): string | undefined {
        if (!isVsTableBodyRow(row)) {
            return undefined;
        }
        const rowItem = getRowItem(row);
        if (!rowItem) {
            return undefined;
        }
        const rowId = getRowId(row);
        if (!rowId) {
            return undefined;
        }
        const rowIdx = row[0]?.rowIdx;
        if (!expandable.value(rowItem, rowIdx, items.value)) {
            return undefined;
        }
        return rowId;
    }

    return {
        anyExpandable,
        isExpanded,
        toggleExpand,
        setExpand,
    };
}
