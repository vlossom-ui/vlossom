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

    function findNearestActiveIndex(targetIndex: number): number {
        // 앞에서부터 보면서 더 가까울 때만 바꾸므로, 거리가 같으면 앞쪽 index가 남는다
        return list.value.reduce<number>((nearestIndex, _, index) => {
            if (isDisabled(index)) {
                return nearestIndex;
            }
            if (nearestIndex === NOT_SELECTED || Math.abs(index - targetIndex) < Math.abs(nearestIndex - targetIndex)) {
                return index;
            }
            return nearestIndex;
        }, NOT_SELECTED);
    }

    function syncIndex(index: number) {
        if (index === NOT_SELECTED) {
            selectedIndex.value = NOT_SELECTED;
            return;
        }

        const nearestIndex = findNearestActiveIndex(index);
        // #768: 고를 수 있는 항목이 없으면(빈 list, 모두 disabled) 부모의 index를 지킨다
        selectedIndex.value = nearestIndex === NOT_SELECTED ? index : nearestIndex;
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

    // disabled 함수가 읽는 reactive 값의 변경도 따라가도록 함수 참조가 아니라 항목별 결과를 본다
    watch(
        () => list.value.map((_, index) => isDisabled(index)),
        () => syncIndex(selectedIndex.value),
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
