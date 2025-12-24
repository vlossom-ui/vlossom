import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { BodyCell, ColumnDef, VsTableSearchOptions } from '../types';

export function useTableSearch(columns: ComputedRef<ColumnDef[] | null>) {
    const searchText = ref('');
    const searchOptions = ref<VsTableSearchOptions>({
        caseSensitive: false,
        regex: false,
    });

    const searchableKeys = computed<string[]>(() => {
        if (!columns.value) {
            return [];
        }
        return columns.value.filter((col) => col.searchable !== false).map((col) => col.key);
    });

    function matchText(text: string): boolean {
        if (!searchText.value) {
            return true;
        }

        const searchValue = searchOptions.value.caseSensitive ? searchText.value : searchText.value.toLowerCase();
        const targetText = searchOptions.value.caseSensitive ? text : text.toLowerCase();

        if (searchOptions.value.regex) {
            try {
                const flags = searchOptions.value.caseSensitive ? 'g' : 'gi';
                const regexPattern = new RegExp(searchValue, flags);
                return regexPattern.test(targetText);
            } catch {
                return targetText.includes(searchValue);
            }
        }

        return targetText.includes(searchValue);
    }

    function filterRow(row: BodyCell[]): boolean {
        if (!searchText.value) {
            return true;
        }

        return row.some((cell) => {
            if (!searchableKeys.value.includes(cell.colKey)) {
                return false;
            }
            const cellValue = cell.value != null ? String(cell.value) : '';
            return matchText(cellValue);
        });
    }

    function filterRows(rows: BodyCell[][]): BodyCell[][] {
        if (!searchText.value) {
            return rows;
        }
        return rows.filter(filterRow);
    }

    function updateSearch(text: string, options?: VsTableSearchOptions): void {
        searchText.value = text;
        if (options) {
            searchOptions.value = options;
        }
    }

    return {
        searchText,
        searchOptions,
        filterRows,
        updateSearch,
    };
}

