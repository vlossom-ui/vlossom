import { computed, ref, type Ref } from 'vue';

export function useIndexSelector(
    list: Ref<any[]>,
    disabled?: Ref<((item: any, index: number) => boolean) | undefined>,
) {
    const selectedIndex = ref(0);

    function isSelected(index: number): boolean {
        return selectedIndex.value === index;
    }

    function isDisabled(index: number): boolean {
        if (!disabled || !disabled.value) {
            return false;
        }
        return disabled.value(list.value[index], index);
    }

    function findNextActiveIndex(startIndex: number): number {
        const length = list.value.length;
        for (let i = 0; i < length; i++) {
            const currentIndex = (startIndex + i) % length;
            if (!isDisabled(currentIndex)) {
                return currentIndex;
            }
        }
        return startIndex;
    }

    function findPreviousActiveIndex(startIndex: number): number {
        const length = list.value.length;
        for (let i = 0; i < length; i++) {
            const currentIndex = (startIndex - i + length) % length;
            if (!isDisabled(currentIndex)) {
                return currentIndex;
            }
        }
        return startIndex;
    }

    function getInitialIndex(value: number): number {
        if (value >= 0 && value < list.value.length && !isDisabled(value)) {
            return value;
        }
        return findNextActiveIndex(0);
    }

    function selectIndex(index: number) {
        if (isDisabled(index)) {
            return;
        }
        selectedIndex.value = index;
    }

    const isFirstEdge = computed(() => {
        const firstActiveIndex = findNextActiveIndex(0);
        return selectedIndex.value === firstActiveIndex;
    });

    const isLastEdge = computed(() => {
        const lastActiveIndex = findPreviousActiveIndex(list.value.length - 1);
        return selectedIndex.value === lastActiveIndex;
    });

    function handleKeydown(e: KeyboardEvent, isVertical: boolean) {
        const keyMap = {
            prev: isVertical ? 'ArrowUp' : 'ArrowLeft',
            next: isVertical ? 'ArrowDown' : 'ArrowRight',
        };

        if (e.key === keyMap.prev) {
            if (isFirstEdge.value) {
                return;
            }
            e.preventDefault();
            selectIndex(findPreviousActiveIndex(selectedIndex.value - 1));
        } else if (e.key === keyMap.next) {
            if (isLastEdge.value) {
                return;
            }
            e.preventDefault();
            selectIndex(findNextActiveIndex(selectedIndex.value + 1));
        } else if (e.key === 'Home') {
            e.preventDefault();
            selectIndex(findNextActiveIndex(0));
        } else if (e.key === 'End') {
            e.preventDefault();
            selectIndex(findPreviousActiveIndex(list.value.length - 1));
        }
    }

    return {
        selectedIndex,
        isSelected,
        isDisabled,
        findNextActiveIndex,
        findPreviousActiveIndex,
        getInitialIndex,
        selectIndex,
        handleKeydown,
        isFirstEdge,
        isLastEdge,
    };
}
