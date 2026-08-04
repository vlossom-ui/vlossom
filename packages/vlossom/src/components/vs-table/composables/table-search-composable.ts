import { computed, type ComputedRef, type Ref } from 'vue';
import type { VsSearchInputRef } from '@/components';
import { objectUtil } from '@/utils';
import { type VsTableColumnDef, type VsTableRow, type VsTableSearchOptions } from './../types';

function toSearchText(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }
    if (Array.isArray(value) || objectUtil.isObject(value)) {
        return Object.values(objectUtil.crush(value)).map(toSearchText).filter(Boolean).join(' ');
    }
    return String(value);
}

export function useTableSearch(
    ref: Ref<VsSearchInputRef | null>,
    columns: ComputedRef<VsTableColumnDef[] | null>,
    search: ComputedRef<VsTableSearchOptions>,
) {
    const skipKeys = computed<Set<string>>(() => {
        const keys = (columns.value ?? []).filter((column) => column.skipSearch).map((column) => column.key);
        return new Set(keys);
    });

    // 같은 키가 skipSearch 컬럼이면서 extraKeys에도 있으면, 노출 사고를 막기 위해 제외를 우선한다.
    const extraKeys = computed<string[]>(() => {
        return (search.value.extraKeys ?? []).filter((key) => !skipKeys.value.has(key));
    });

    function matchBySearch(row: VsTableRow): boolean {
        if (!ref.value) {
            return true;
        }

        const cellTexts = row.cells
            .filter((cell) => !skipKeys.value.has(cell.colKey))
            .map((cell) => toSearchText(cell.value));
        const extraTexts = extraKeys.value.map((key) => toSearchText(objectUtil.get(row.item, key)));

        const flattenedItemText = [...cellTexts, ...extraTexts].filter(Boolean).join(' ');
        return ref.value.match(flattenedItemText);
    }

    return {
        matchBySearch,
    };
}
