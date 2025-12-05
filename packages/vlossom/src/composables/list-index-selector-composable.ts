import { computed, ref, type Ref } from 'vue';
import { INVALID_INDEX } from '@/declaration';

export function useIndexSelector(
    list: Ref<any[]>,
    disabled?: Ref<boolean | ((item: any, index: number) => boolean) | undefined>,
) {
    const selectedIndex = ref(0);

    function isOutOfRange(index: number): boolean {
        return index < 0 || index > list.value.length - 1;
    }

    function isSelected(index: number): boolean {
        return selectedIndex.value === index;
    }

    function isDisabled(index: number): boolean {
        if (!disabled || disabled.value === undefined) {
            return false;
        }

        if (typeof disabled.value === 'boolean') {
            return disabled.value;
        }

        return disabled.value(list.value[index], index);
    }

    function isPrevious(index: number) {
        return index < selectedIndex.value;
    }

    function isAllDisabled(): boolean {
        if (!disabled || disabled.value === undefined) {
            return false;
        }

        if (typeof disabled.value === 'boolean') {
            return disabled.value;
        }

        return list.value.every((_, i) => isDisabled(i));
    }

    function findActiveIndexForwardFrom(targetIndex: number): number {
        if (isOutOfRange(targetIndex)) {
            return INVALID_INDEX;
        }

        if (!isDisabled(targetIndex)) {
            return targetIndex;
        }

        for (let i = targetIndex + 1; i < list.value.length; i++) {
            if (!isDisabled(i)) {
                return i;
            }
        }

        return INVALID_INDEX;
    }

    function findActiveIndexBackwardFrom(targetIndex: number): number {
        if (isOutOfRange(targetIndex)) {
            return INVALID_INDEX;
        }

        if (!isDisabled(targetIndex)) {
            return targetIndex;
        }

        for (let i = targetIndex - 1; i >= 0; i--) {
            if (!isDisabled(i)) {
                return i;
            }
        }
        return INVALID_INDEX;
    }

    function selectIndex(index: number) {
        if (isOutOfRange(index) || isAllDisabled() || isDisabled(index)) {
            selectedIndex.value = INVALID_INDEX;
            return;
        }

        selectedIndex.value = index;
    }

    const isFirstEdge = computed(() => {
        const firstActiveIndex = findActiveIndexForwardFrom(0);
        return selectedIndex.value === firstActiveIndex;
    });

    const isLastEdge = computed(() => {
        const lastActiveIndex = findActiveIndexBackwardFrom(list.value.length - 1);
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
            selectIndex(findActiveIndexBackwardFrom(selectedIndex.value - 1));
        } else if (e.key === keyMap.next) {
            if (isLastEdge.value) {
                return;
            }
            e.preventDefault();
            selectIndex(findActiveIndexForwardFrom(selectedIndex.value + 1));
        } else if (e.key === 'Home') {
            e.preventDefault();
            selectIndex(findActiveIndexForwardFrom(0));
        } else if (e.key === 'End') {
            e.preventDefault();
            selectIndex(findActiveIndexBackwardFrom(list.value.length - 1));
        }
    }

    return {
        selectedIndex,
        isSelected,
        isDisabled,
        isPrevious,
        findActiveIndexForwardFrom,
        findActiveIndexBackwardFrom,
        selectIndex,
        handleKeydown,
        isFirstEdge,
        isLastEdge,
    };
}
