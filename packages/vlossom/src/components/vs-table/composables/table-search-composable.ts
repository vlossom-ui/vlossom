import { computed, type ComputedRef, type Ref } from 'vue';
import type { VsSearchInputRef } from '@/components';
import { objectUtil } from '@/utils';
import { type VsTableColumnDef, type VsTableRow, type VsTableSearchOptions } from './../types';

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
    // 부모 컬럼을 제외했는데 하위 경로가 extraKeys로 되살아나지 않도록 prefix까지 본다.
    const extraKeys = computed<string[]>(() => {
        const isSkipped = (key: string) =>
            [...skipKeys.value].some((skipKey) => key === skipKey || key.startsWith(`${skipKey}.`));
        return (search.value.extraKeys ?? []).filter((key) => !isSkipped(key));
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

    // plain object뿐 아니라 클래스 인스턴스도 순회해야 하므로 isObject 대신 typeof로 판별
    function toSearchText(value: unknown, seen = new WeakSet<object>()): string {
        if (value === null || value === undefined || typeof value === 'function') {
            return '';
        }
        if (typeof value !== 'object') {
            return String(value);
        }
        if (value instanceof Date) {
            return value.toISOString();
        }
        if (ArrayBuffer.isView(value)) {
            return '';
        }
        if (seen.has(value)) {
            return '';
        }
        seen.add(value);

        const values =
            value instanceof Map || value instanceof Set ? [...value.values()] : Object.values(value as object);
        return values
            .map((child) => toSearchText(child, seen))
            .filter(Boolean)
            .join(' ');
    }

    return {
        matchBySearch,
    };
}
