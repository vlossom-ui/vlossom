import { computed, type ComputedRef, type Ref, type TemplateRef } from 'vue';
import type { OptionItem } from '@/declaration';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';
import { FOCUSABLE_SEARCH, FOCUSABLE_SELECT_ALL } from './../constants';

interface UseSelectKeyboardParams {
    isOpen: Ref<boolean>;
    focusIndex: Ref<number>;
    focusableKeys: ComputedRef<string[]>;
    currentFocusableKey: ComputedRef<string | null>;
    searchInputRef: TemplateRef<VsSearchInputRef>;
    filteredOptions: ComputedRef<OptionItem[]>;
    updateFocusIndex: (index: number) => void;
    scrollFocusIntoView: (key: string) => void;
    openOptions: () => void;
    closeOptions: () => void;
    focusTrigger: () => void;
    toggleSelectAll: () => void;
    selectOptionItem: (optionItem: OptionItem) => void;
}

export function useSelectKeyboard({
    isOpen,
    focusIndex,
    focusableKeys,
    currentFocusableKey,
    searchInputRef,
    filteredOptions,
    updateFocusIndex,
    scrollFocusIntoView,
    openOptions,
    closeOptions,
    focusTrigger,
    toggleSelectAll,
    selectOptionItem,
}: UseSelectKeyboardParams) {
    function isSearchFocused() {
        return currentFocusableKey.value === FOCUSABLE_SEARCH;
    }

    function moveSelectFocus(index: number) {
        updateFocusIndex(index);

        const key = currentFocusableKey.value;
        if (key === null) {
            return;
        }

        if (key === FOCUSABLE_SEARCH) {
            searchInputRef.value?.focus();
            return;
        }

        searchInputRef.value?.blur();
        scrollFocusIntoView(key);
    }

    function handleSelectionKey() {
        if (!isOpen.value) {
            openOptions();
            return;
        }

        const key = currentFocusableKey.value;
        if (key === null || key === FOCUSABLE_SEARCH) {
            return;
        }

        if (key === FOCUSABLE_SELECT_ALL) {
            toggleSelectAll();
            return;
        }

        const optionItem = filteredOptions.value.find((option) => option.id === key);
        if (optionItem) {
            selectOptionItem(optionItem);
        }
    }

    const computedCallbacks = computed(() => {
        return {
            'key-ArrowUp': (e: KeyboardEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (isOpen.value) {
                    moveSelectFocus(Math.max(focusIndex.value - 1, 0));
                }
            },
            'key-ArrowDown': (e: KeyboardEvent) => {
                e.preventDefault();
                e.stopPropagation();

                if (isOpen.value) {
                    moveSelectFocus(focusIndex.value + 1);
                } else {
                    openOptions();
                }
            },
            'key-Home': (e: KeyboardEvent) => {
                if (!isOpen.value) {
                    return;
                }
                if (!isSearchFocused()) {
                    e.preventDefault();
                }
                e.stopPropagation();
                moveSelectFocus(0);
            },
            'key-End': (e: KeyboardEvent) => {
                if (!isOpen.value) {
                    return;
                }
                if (!isSearchFocused()) {
                    e.preventDefault();
                }
                e.stopPropagation();
                moveSelectFocus(focusableKeys.value.length - 1);
            },
            'key-Enter': (e: KeyboardEvent) => {
                if (!isSearchFocused()) {
                    e.preventDefault();
                }
                e.stopPropagation();
                handleSelectionKey();
            },
            'key-Space': (e: KeyboardEvent) => {
                if (!isSearchFocused()) {
                    e.preventDefault();
                }
                e.stopPropagation();
                handleSelectionKey();
            },
            'key-Tab': () => {
                if (isSearchFocused()) {
                    return;
                }
                if (isOpen.value) {
                    closeOptions();
                }
            },
            'key-Escape': (e: KeyboardEvent) => {
                e.preventDefault();
                e.stopPropagation();
                closeOptions();
                focusTrigger();
            },
        };
    });

    return {
        computedCallbacks,
    };
}
