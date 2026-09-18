import { computed, type ComputedRef, type Ref, type TemplateRef } from 'vue';
import { objectUtil } from '@/utils';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';
import type { VsTable2ColumnDef, VsTable2Item, VsTable2SearchOptions } from './../types';
import { TABLE_SEARCH_OPTIONS } from './../constants';
import { getCellValue } from './table-column-composable';

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

    const values = value instanceof Map || value instanceof Set ? [...value.values()] : Object.values(value as object);
    return values
        .map((child) => toSearchText(child, seen))
        .filter(Boolean)
        .join(' ');
}

export function useTableSearchComposable(
    searchInputRef: TemplateRef<VsSearchInputRef>,
    rawSearch: Ref<boolean | VsTable2SearchOptions>,
    columns: ComputedRef<VsTable2ColumnDef[]>,
    items: Ref<VsTable2Item[]>,
) {
    const search = computed<VsTable2SearchOptions>(() => {
        if (!rawSearch.value) {
            return {};
        }
        if (typeof rawSearch.value === 'boolean') {
            return TABLE_SEARCH_OPTIONS;
        }
        return { ...TABLE_SEARCH_OPTIONS, ...rawSearch.value };
    });

    const searchOptions = computed(() => objectUtil.omit(search.value, ['extraKeys']));

    // 같은 키가 skipSearch 컬럼이면서 extraKeys에도 있으면, 노출 사고를 막기 위해 제외를 우선한다.
    // 부모 컬럼을 제외했는데 하위 경로가 extraKeys로 되살아나지 않도록 prefix까지 본다.
    const extraKeys = computed<string[]>(() => {
        const skipKeys = columns.value.filter((column) => column.skipSearch).map((column) => column.key);
        return (search.value.extraKeys ?? []).filter(
            (key) => !skipKeys.some((skipKey) => key === skipKey || key.startsWith(`${skipKey}.`)),
        );
    });

    function getItemSearchText(item: VsTable2Item): string {
        const cellTexts = columns.value
            .filter((column) => !column.skipSearch)
            .map((column) => toSearchText(getCellValue(item, column)));
        const extraTexts = extraKeys.value.map((key) => toSearchText(objectUtil.get(item, key)));
        return [...cellTexts, ...extraTexts].filter(Boolean).join(' ');
    }

    const searchedItems = computed<VsTable2Item[]>(() => {
        const searchInput = searchInputRef.value;
        // 검색어가 없으면 어차피 전부 통과하므로, 아이템마다 검색 텍스트를 만드는 비용을 건너뛴다
        if (!searchInput?.searchText) {
            return items.value;
        }
        return items.value.filter((item) => searchInput.match(getItemSearchText(item)));
    });

    return { searchOptions, searchedItems };
}
