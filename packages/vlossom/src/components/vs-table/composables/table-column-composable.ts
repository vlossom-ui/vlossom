import { computed, type Ref } from 'vue';
import { objectUtil, stringUtil } from '@/utils';
import type { VsTableColumnDef, VsTableItem } from './../types';

export function getCellValue(item: VsTableItem, column: VsTableColumnDef): unknown {
    const value: unknown = objectUtil.get(item, column.key);
    return column.transform ? column.transform(value, item) : value;
}

export function useTableColumnComposable(
    rawColumns: Ref<VsTableColumnDef[] | string[] | undefined>,
    items: Ref<VsTableItem[]>,
    handleColumns: { drag: Ref<boolean>; select: Ref<boolean>; expand: Ref<boolean> },
) {
    const columns = computed<VsTableColumnDef[]>(() => {
        const columnDefs = rawColumns.value;
        if (columnDefs?.length) {
            return columnDefs.map((column) => (typeof column === 'string' ? { key: column, label: column } : column));
        }

        const firstItem = items.value[0];
        if (!firstItem || typeof firstItem !== 'object') {
            return [];
        }
        return Object.keys(firstItem).map((key) => ({ key, label: key }));
    });

    const gridTemplateColumns = computed<string>(() => {
        const tracks: string[] = [];
        if (handleColumns.drag.value) {
            tracks.push('auto');
        }
        if (handleColumns.select.value) {
            tracks.push('auto');
        }
        columns.value.forEach((column) => tracks.push(getGridColumnWidth(column)));
        if (handleColumns.expand.value) {
            tracks.push('auto');
        }
        return tracks.join(' ');
    });

    function getGridColumnWidth(column: VsTableColumnDef): string {
        const { width, minWidth, maxWidth } = column;
        if (width) {
            return stringUtil.toStringSize(width);
        }
        const min = minWidth ? stringUtil.toStringSize(minWidth) : null;
        const max = maxWidth ? stringUtil.toStringSize(maxWidth) : null;
        if (min && max) {
            return `minmax(${min}, ${max})`;
        }
        if (min) {
            return `minmax(${min}, 1fr)`;
        }
        if (max) {
            return `minmax(auto, ${max})`;
        }
        return 'minmax(max-content, 1fr)';
    }

    return { columns, gridTemplateColumns };
}
