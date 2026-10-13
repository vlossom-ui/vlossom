import { computed, readonly, ref, watch, type ComputedRef, type DeepReadonly, type Ref, type TemplateRef } from 'vue';
import { functionUtil } from '@/utils';

export function useFocusable(
    wrapperElement: TemplateRef<HTMLElement>,
    focusableKeys?: Ref<string[]>,
): {
    focusIndex: DeepReadonly<Ref<number>>;
    currentFocusableElement: DeepReadonly<Ref<HTMLElement | null>>;
    focusedKey: ComputedRef<string | null>;
    isFocused: (key: string) => boolean;
    updateFocusIndex: (index: number) => void;
    getFocusableElements: () => HTMLElement[];
    addMouseMoveListener: () => void;
    removeMouseMoveListener: () => void;
} {
    const focusIndex = ref(-1);
    const currentFocusableElement = ref<HTMLElement | null>(null);

    const focusedKey = computed(() => focusableKeys?.value[focusIndex.value] ?? null);

    function isFocused(key: string) {
        return focusedKey.value === key;
    }

    function getFocusableElements() {
        const focusableElements = wrapperElement.value?.querySelectorAll<HTMLElement>('[data-focusable]');
        if (!focusableElements) {
            return [];
        }

        return Array.from(focusableElements);
    }

    function getFocusableCount() {
        return focusableKeys ? focusableKeys.value.length : getFocusableElements().length;
    }

    function updateFocusIndex(index: number) {
        if (index < 0) {
            focusIndex.value = -1;
            return;
        }

        const focusableCount = getFocusableCount();
        if (index >= focusableCount) {
            focusIndex.value = focusableCount - 1;
            return;
        }

        focusIndex.value = index;
    }

    function getTargetIndex(targetElement: HTMLElement) {
        if (focusableKeys) {
            return focusableKeys.value.indexOf(targetElement.dataset['focusable'] ?? '');
        }
        return getFocusableElements().indexOf(targetElement);
    }

    function trackMouseMove(event: MouseEvent) {
        if (!wrapperElement.value) {
            return;
        }

        const targetElement: HTMLElement | null = (event.target as HTMLElement).closest('[data-focusable]');

        if (!targetElement || targetElement === currentFocusableElement.value) {
            return;
        }

        const targetIndex = getTargetIndex(targetElement);
        if (targetIndex === -1) {
            return;
        }

        updateFocusIndex(targetIndex);
    }

    const throttledTrackMouseMove = functionUtil.throttle({ interval: 25 }, trackMouseMove);

    function addMouseMoveListener() {
        wrapperElement.value?.addEventListener('mousemove', throttledTrackMouseMove);
    }

    function removeMouseMoveListener() {
        wrapperElement.value?.removeEventListener('mousemove', throttledTrackMouseMove);
    }

    // key 모드(virtual scroll 등)에서는 DOM 요소가 언제든 언마운트/재활용될 수 있다.
    // 이 경우 watch 안에서 직접 붙인 class는 재렌더 시 사라지고, currentFocusableElement에
    // 저장된 참조도 stale해져 신뢰할 수 없다. 따라서 key 모드에서는 watcher 자체를 등록하지 않고,
    // 사용하는 쪽에서 isFocused(key)로 vs-focusable-active를 반응형 바인딩한다.
    if (!focusableKeys) {
        watch(focusIndex, () => {
            if (!wrapperElement.value) {
                return;
            }

            if (currentFocusableElement.value) {
                currentFocusableElement.value.classList.remove('vs-focusable-active');
            }

            if (focusIndex.value === -1) {
                currentFocusableElement.value = null;
                return;
            }

            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0) {
                return;
            }

            const targetElement = focusableElements[focusIndex.value];
            if (!targetElement) {
                return;
            }

            targetElement.classList.add('vs-focusable-active');
            currentFocusableElement.value = targetElement;
        });
    }

    return {
        focusIndex: readonly(focusIndex),
        currentFocusableElement: readonly(currentFocusableElement),
        focusedKey,
        isFocused,
        updateFocusIndex,
        getFocusableElements,
        addMouseMoveListener,
        removeMouseMoveListener,
    };
}
