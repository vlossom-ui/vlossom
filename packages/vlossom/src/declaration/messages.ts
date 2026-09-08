import type { VlossomMessageParams, VlossomMessages } from './types';

export const DEFAULT_MESSAGES: VlossomMessages = {
    VS_VALIDATION_REQUIRED: 'required',
    VS_VALIDATION_MAX_VALUE: ({ value }: VlossomMessageParams) => `max value: ${value}`,
    VS_VALIDATION_MIN_VALUE: ({ value }: VlossomMessageParams) => `min value: ${value}`,
    VS_VALIDATION_MAX_LENGTH: ({ value }: VlossomMessageParams) => `max length: ${value}`,
    VS_VALIDATION_MIN_LENGTH: ({ value }: VlossomMessageParams) => `min length: ${value}`,
    VS_VALIDATION_MAX_ITEMS: ({ value }: VlossomMessageParams) => `max number of items: ${value}`,
    VS_VALIDATION_MIN_ITEMS: ({ value }: VlossomMessageParams) => `min number of items: ${value}`,
    VS_VALIDATION_DATE_MIN: ({ value }: VlossomMessageParams) => `Must be on or after ${value}`,
    VS_VALIDATION_DATE_MAX: ({ value }: VlossomMessageParams) => `Must be on or before ${value}`,
    VS_VALIDATION_FILE_MAX: ({ value }: VlossomMessageParams) => `You can only upload up to ${value} files`,
    VS_VALIDATION_FILE_MIN: ({ value }: VlossomMessageParams) => `You must upload at least ${value} files`,
    VS_VALIDATION_FILE_TYPE: ({ value }: VlossomMessageParams) => `Allowed: ${value}`,
    VS_VALIDATION_SINGLE_FILE: () => 'You can only upload one file',
    VS_TABLE_NO_DATA: 'NO DATA',
    VS_TABLE_ITEMS_SUMMARY: '{start}-{end} / {total} items',
    VS_TABLE_PAGE_SIZE_ALL: 'All',
    VS_TABLE_PAGE_SIZE_ITEMS: '{size} items',
    VS_SELECT_NO_OPTIONS: 'No Options',
    VS_GROUPED_LIST_UNGROUPED: 'Ungrouped',
    VS_SEARCH_INPUT_PLACEHOLDER: 'Search',
    VS_ARIA_INPUT_CLEAR: 'Clear',
    VS_ARIA_SELECT_CLEAR: 'Clear',
    VS_ARIA_FILE_DROP_CLEAR: 'Clear',
    VS_ARIA_CHIP_CLOSE: 'close',
    VS_ARIA_TEXT_WRAP_COPY: 'copy',
    VS_ARIA_TEXT_WRAP_LINK: 'link',
    VS_ARIA_PAGINATION_FIRST: 'go to first page',
    VS_ARIA_PAGINATION_PREVIOUS: 'go to previous page',
    VS_ARIA_PAGINATION_PAGE: 'go to page {page}',
    VS_ARIA_PAGINATION_NEXT: 'go to next page',
    VS_ARIA_PAGINATION_LAST: 'go to last page',
    VS_ARIA_TABS_PREVIOUS_HORIZONTAL: 'previous tab (left)',
    VS_ARIA_TABS_PREVIOUS_VERTICAL: 'previous tab (up)',
    VS_ARIA_TABS_NEXT_HORIZONTAL: 'next tab (right)',
    VS_ARIA_TABS_NEXT_VERTICAL: 'next tab (down)',
    VS_ARIA_SEARCH_INPUT_CASE_SENSITIVE: 'case sensitive',
    VS_ARIA_SEARCH_INPUT_CASE_INSENSITIVE: 'case insensitive',
    VS_ARIA_SEARCH_INPUT_REGEX: 'regex',
    VS_ARIA_SEARCH_INPUT_NO_REGEX: 'no regex',
    VS_ARIA_THEME_BUTTON_LIGHT: 'Switch to light mode',
    VS_ARIA_THEME_BUTTON_DARK: 'Switch to dark mode',
    VS_ARIA_MODAL_LABEL: 'Modal',
    VS_ALERT_OK: 'OK',
    VS_CONFIRM_OK: 'OK',
    VS_CONFIRM_CANCEL: 'Cancel',
    VS_PROMPT_OK: 'OK',
    VS_PROMPT_CANCEL: 'Cancel',
};

export function formatMessage(
    template: string | ((params: VlossomMessageParams) => string),
    params: VlossomMessageParams = {},
): string {
    if (typeof template === 'function') {
        return template(params);
    }
    return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}
