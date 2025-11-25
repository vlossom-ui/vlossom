import { computed, ref, type Ref } from 'vue';

export function useIndexSelector(list: Ref<any[]>, disabled: Ref<number[]> = ref([])) {
    const selectedIndex = ref(0);

    function isSelected(index: number): boolean {
        return selectedIndex.value === index;
    }

    function isDisabled(index: number): boolean {
        return disabled.value.includes(index);
    }

    function findNextActivedIndex(startIndex: number): number {
        const length = list.value.length;
        for (let i = 0; i < length; i++) {
            const currentIndex = (startIndex + i) % length;
            if (!isDisabled(currentIndex)) {
                return currentIndex;
            }
        }
        return startIndex;
    }

    function findPreviousActivedIndex(startIndex: number): number {
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
        return findNextActivedIndex(0);
    }

    function selectIndex(index: number) {
        if (isDisabled(index)) {
            return;
        }
        selectedIndex.value = index;
    }

    const isFirstEdge = computed(() => {
        const firstActiveIndex = findNextActivedIndex(0);
        return selectedIndex.value === firstActiveIndex;
    });

    const isLastEdge = computed(() => {
        const lastActiveIndex = findPreviousActivedIndex(list.value.length - 1);
        return selectedIndex.value === lastActiveIndex;
    });

    function handleKeydown(e: KeyboardEvent, isVertical: boolean) {
        const isHorizontal = !isVertical;

        if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
            if (isFirstEdge.value) {
                return;
            }

            e.preventDefault();
            const targetIndex = findPreviousActivedIndex(selectedIndex.value - 1);
            selectIndex(targetIndex);
        } else if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
            if (isLastEdge.value) {
                return;
            }

            e.preventDefault();
            const targetIndex = findNextActivedIndex(selectedIndex.value + 1);
            selectIndex(targetIndex);
        } else if (e.key === 'Home') {
            e.preventDefault();
            selectIndex(findNextActivedIndex(0));
        } else if (e.key === 'End') {
            e.preventDefault();
            selectIndex(findPreviousActivedIndex(list.value.length - 1));
        }
    }

    return {
        selectedIndex,
        isSelected,
        isDisabled,
        findNextActivedIndex,
        findPreviousActivedIndex,
        getInitialIndex,
        selectIndex,
        handleKeydown,
        isFirstEdge,
        isLastEdge,
    };
}
