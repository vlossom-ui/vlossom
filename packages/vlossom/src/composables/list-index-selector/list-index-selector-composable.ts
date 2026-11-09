import { computed, ref, watch, type Ref } from 'vue';
import { NOT_SELECTED } from '@/declaration';

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
            return NOT_SELECTED;
        }

        if (!isDisabled(targetIndex)) {
            return targetIndex;
        }

        for (let i = targetIndex + 1; i < list.value.length; i++) {
            if (!isDisabled(i)) {
                return i;
            }
        }

        return NOT_SELECTED;
    }

    function findActiveIndexBackwardFrom(targetIndex: number): number {
        if (isOutOfRange(targetIndex)) {
            return NOT_SELECTED;
        }

        if (!isDisabled(targetIndex)) {
            return targetIndex;
        }

        for (let i = targetIndex - 1; i >= 0; i--) {
            if (!isDisabled(i)) {
                return i;
            }
        }
        return NOT_SELECTED;
    }

    function selectIndex(index: number) {
        if (isOutOfRange(index)) {
            selectedIndex.value = NOT_SELECTED;
            return;
        }
        if (isAllDisabled() || isDisabled(index)) {
            return;
        }
        selectedIndex.value = index;
    }

    // 목록이 비어 있는 동안 받은 인덱스: 비동기 로드 전에 -1로 바꾸면 부모 v-model이 덮어써지므로 채워질 때 적용한다
    let pendingIndex: number | null = null;

    function syncIndex(index: number) {
        if (list.value.length === 0) {
            pendingIndex = index;
            return;
        }
        pendingIndex = null;
        if (isOutOfRange(index)) {
            selectedIndex.value = NOT_SELECTED;
        } else {
            selectedIndex.value = index;
        }
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

    watch(
        () => list.value.length,
        () => {
            if (isOutOfRange(selectedIndex.value)) {
                selectedIndex.value = NOT_SELECTED;
            }
        },
    );

    watch(
        () => list.value.length,
        (length) => {
            if (length > 0 && pendingIndex !== null) {
                syncIndex(pendingIndex);
            }
        },
    );

    return {
        selectedIndex,
        isSelected,
        isDisabled,
        isAllDisabled,
        isPrevious,
        findActiveIndexForwardFrom,
        findActiveIndexBackwardFrom,
        selectIndex,
        syncIndex,
        handleKeydown,
        isFirstEdge,
        isLastEdge,
    };
}
