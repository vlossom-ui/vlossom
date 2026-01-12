import { computed, nextTick, type ComputedRef, type DeepReadonly, type Ref, type TemplateRef } from 'vue';
import type { OptionItem } from '@/declaration';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';

interface UseSelectKeyboardParams {
    isOpen: Ref<boolean>;
    focusIndex: Ref<number>;
    currentFocusableElement: DeepReadonly<Ref<HTMLElement | null>>;
    searchInputRef: TemplateRef<VsSearchInputRef>;
    filteredOptions: ComputedRef<OptionItem[]>;
    updateFocusIndex: (index: number) => void;
    getFocusableElements: () => HTMLElement[];
    openOptions: () => void;
    closeOptions: () => void;
    toggleSelectAll: () => void;
    selectOptionItem: (optionItem: OptionItem) => void;
}

export function useSelectKeyboard({
    isOpen,
    focusIndex,
    currentFocusableElement,
    searchInputRef,
    filteredOptions,
    updateFocusIndex,
    getFocusableElements,
    openOptions,
    closeOptions,
    toggleSelectAll,
    selectOptionItem,
}: UseSelectKeyboardParams) {
    function getCurrentFocusableRole() {
        return currentFocusableElement.value?.dataset['role'];
    }

    function isSearchFocused() {
        return getCurrentFocusableRole() === 'search';
    }

    function moveSelectFocus(index: number) {
        updateFocusIndex(index);

        nextTick(() => {
            currentFocusableElement.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            if (isSearchFocused()) {
                searchInputRef.value?.focus();
            } else {
                searchInputRef.value?.blur();
            }
        });
    }

    function handleSelectionKey() {
        if (isOpen.value) {
            const role = getCurrentFocusableRole();
            if (role === 'search') {
                return;
            } else if (role === 'select-all') {
                toggleSelectAll();
            } else {
                const optionId = currentFocusableElement.value?.dataset['id'];
                if (optionId) {
                    const optionItem = filteredOptions.value.find((o) => o.id === optionId);
                    if (optionItem) {
                        selectOptionItem(optionItem);
                    }
                }
            }
        } else {
            openOptions();
        }
    }

    const computedCallbacks = computed(() => {
        return {
            'key-ArrowUp': (e: KeyboardEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (isOpen.value) {
                    const nextFocusIndex = Math.max(focusIndex.value - 1, 0);
                    moveSelectFocus(nextFocusIndex);
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
                moveSelectFocus(getFocusableElements().length - 1);
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
            },
        };
    });

    return {
        computedCallbacks,
    };
}
