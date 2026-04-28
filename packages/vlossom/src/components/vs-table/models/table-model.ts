import type { VsTableBodyCell, VsTableCell, VsTableColumnDef, VsTableItem } from '@/components/vs-table/types';

export function isVsTableColumnDef(value: unknown): value is VsTableColumnDef {
    return typeof value === 'object' && value !== null && 'key' in value && 'label' in value;
}

export function isVsTableColumnDefArray(value: unknown): value is VsTableColumnDef[] {
    return Array.isArray(value) && value.length > 0 && value.every(isVsTableColumnDef);
}

export function isVsTableBodyRow(row: VsTableCell[]): row is VsTableBodyCell[] {
    return row[0]?.tag === 'td';
}

export function getRowItem(row: VsTableBodyCell[]): VsTableItem {
    const anyCell = row[0];
    if (!anyCell) {
        return {};
    }
    return anyCell.item;
}

export function getRowId(row: VsTableBodyCell[]): string | undefined {
    return row[0]?.id ?? undefined;
}
