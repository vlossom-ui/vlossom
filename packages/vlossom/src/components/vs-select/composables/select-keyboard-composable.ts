import { computed, nextTick, ref, watch, type ComputedRef, type DeepReadonly, type Ref, type TemplateRef } from 'vue';
import type { OptionItem } from '@/declaration';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';
import { SELECT_FOCUS_KEY } from './../constants';

function isOptionKey(key: string | null | undefined): key is string {
    return !!key && key !== SELECT_FOCUS_KEY.search && key !== SELECT_FOCUS_KEY.selectAll;
}

interface UseSelectKeyboardParams {
    isOpen: Ref<boolean>;
    focusIndex: DeepReadonly<Ref<number>>;
    focusableKeys: ComputedRef<string[]>;
    focusedKey: ComputedRef<string | null>;
    searchInputRef: TemplateRef<VsSearchInputRef>;
    filteredOptions: ComputedRef<OptionItem[]>;
    isSelected: (optionId: string) => boolean;
    updateFocusIndex: (index: number) => void;
    scrollToOption: (optionId: string) => void;
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
    focusedKey,
    searchInputRef,
    filteredOptions,
    isSelected,
    updateFocusIndex,
    scrollToOption,
    openOptions,
    closeOptions,
    focusTrigger,
    toggleSelectAll,
    selectOptionItem,
}: UseSelectKeyboardParams) {
    // 선택된 옵션으로의 점프는 목록을 연 뒤 옵션 영역에 처음 들어갈 때만 한다.
    // 이후 select-all/search에서 내려올 때는 바로 아래 옵션으로 이동해야 자연스럽다.
    const hasEnteredOptions = ref(false);

    watch(isOpen, (opened) => {
        if (opened) {
            hasEnteredOptions.value = false;
        }
    });

    watch(focusedKey, (key) => {
        if (isOptionKey(key)) {
            hasEnteredOptions.value = true;
        }
    });

    function isSearchFocused() {
        return focusedKey.value === SELECT_FOCUS_KEY.search;
    }

    function findFirstOptionFocusIndex() {
        return focusableKeys.value.findIndex(isOptionKey);
    }

    function findLastOptionFocusIndex() {
        return focusableKeys.value.map(isOptionKey).lastIndexOf(true);
    }

    function findInitialOptionFocusIndex() {
        const selectedFocusIndex = focusableKeys.value.findIndex(isSelected);
        return selectedFocusIndex !== -1 ? selectedFocusIndex : findFirstOptionFocusIndex();
    }

    function getNextFocusIndex() {
        const next = focusableKeys.value[focusIndex.value + 1];
        if (!hasEnteredOptions.value && focusedKey.value && !isOptionKey(focusedKey.value) && isOptionKey(next)) {
            return findInitialOptionFocusIndex();
        }
        return focusIndex.value + 1;
    }

    function moveSelectFocus(index: number) {
        if (index === -1) {
            return;
        }
        updateFocusIndex(index);

        nextTick(() => {
            if (isOptionKey(focusedKey.value)) {
                scrollToOption(focusedKey.value);
            }
            if (isSearchFocused()) {
                searchInputRef.value?.focus();
            } else {
                searchInputRef.value?.blur();
            }
        });
    }

    function handleSelectionKey() {
        if (isOpen.value) {
            const key = focusedKey.value;
            if (key === SELECT_FOCUS_KEY.selectAll) {
                toggleSelectAll();
            } else if (isOptionKey(key)) {
                const optionItem = filteredOptions.value.find((o) => o.id === key);
                if (optionItem) {
                    selectOptionItem(optionItem);
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
                    moveSelectFocus(getNextFocusIndex());
                } else {
                    openOptions();
                }
            },
            'key-Home': (e: KeyboardEvent) => {
                if (!isOpen.value) {
                    return;
                }
                e.stopPropagation();
                if (isSearchFocused()) {
                    return;
                }
                e.preventDefault();
                moveSelectFocus(findFirstOptionFocusIndex());
            },
            'key-End': (e: KeyboardEvent) => {
                if (!isOpen.value) {
                    return;
                }
                e.stopPropagation();
                if (isSearchFocused()) {
                    return;
                }
                e.preventDefault();
                moveSelectFocus(findLastOptionFocusIndex());
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
