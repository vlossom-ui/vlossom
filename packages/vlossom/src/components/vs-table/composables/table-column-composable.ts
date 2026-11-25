import { computed, type ComputedRef, type Ref } from 'vue';
import { objectUtil, stringUtil } from '@/utils';
import type { VsTableColumnDef, VsTableItem } from './../types';
import { DEFAULT_COLUMN_MIN_WIDTH } from './../constants';

export function getCellValue(item: VsTableItem, column: VsTableColumnDef): unknown {
    const value: unknown = objectUtil.get(item, column.key);
    return column.transform ? column.transform(value, item) : value;
}

export function useTableColumnComposable(
    rawColumns: Ref<VsTableColumnDef[] | string[] | undefined>,
    items: Ref<VsTableItem[]>,
) {
    const columns: ComputedRef<VsTableColumnDef[]> = computed(() => {
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

    return { columns };
}

export function useTableGridTemplateComposable(
    columns: Ref<VsTableColumnDef[]>,
    handleColumns: { drag: Ref<boolean>; select: Ref<boolean>; expand: Ref<boolean> },
) {
    const gridTemplateColumns: ComputedRef<string> = computed(() => {
        const tracks: string[] = [];
        if (handleColumns.drag.value) {
            tracks.push('max-content');
        }
        if (handleColumns.select.value) {
            tracks.push('max-content');
        }
        columns.value.forEach((column) => tracks.push(getGridColumnWidth(column)));
        if (handleColumns.expand.value) {
            tracks.push('max-content');
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
            // overflow-wrap: anywhere 때문에 auto 최소 폭은 한 글자까지 줄어든다
            return `minmax(min(${DEFAULT_COLUMN_MIN_WIDTH}, ${max}), ${max})`;
        }
        return 'minmax(max-content, 1fr)';
    }

    // flexible(1fr) 컬럼이 없으면 컬럼 폭의 합이 table 폭이 된다
    const isFitContent: ComputedRef<boolean> = computed(
        () => columns.value.length > 0 && columns.value.every((column) => column.width || column.maxWidth),
    );

    return { gridTemplateColumns, isFitContent };
}
