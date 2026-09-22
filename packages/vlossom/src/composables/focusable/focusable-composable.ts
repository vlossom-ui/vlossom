import { computed, readonly, ref, type ComputedRef, type DeepReadonly, type Ref, type TemplateRef } from 'vue';
import { functionUtil } from '@/utils';

export function useFocusable(
    wrapperElement: TemplateRef<HTMLElement>,
    focusableKeys: Ref<string[]>,
): {
    focusIndex: DeepReadonly<Ref<number>>;
    currentFocusableKey: ComputedRef<string | null>;
    updateFocusIndex: (index: number) => void;
    getFocusableElement: (key: string) => HTMLElement | null;
    addMouseMoveListener: () => void;
    removeMouseMoveListener: () => void;
} {
    const focusIndex = ref(-1);

    // 가상 스크롤을 쓰면 DOM에는 보이는 구간만 있으므로, 포커스 위치는 DOM 순서가 아니라 키 목록으로 센다
    const currentFocusableKey = computed(() => focusableKeys.value[focusIndex.value] ?? null);

    function getFocusableElement(key: string): HTMLElement | null {
        return wrapperElement.value?.querySelector<HTMLElement>(`[data-focusable="${key}"]`) ?? null;
    }

    function updateFocusIndex(index: number) {
        if (index < 0) {
            focusIndex.value = -1;
            return;
        }

        focusIndex.value = Math.min(index, focusableKeys.value.length - 1);
    }

    function trackMouseMove(event: MouseEvent) {
        const targetElement = (event.target as HTMLElement).closest<HTMLElement>('[data-focusable]');
        const key = targetElement?.dataset['focusable'];
        if (!key || key === currentFocusableKey.value) {
            return;
        }

        const targetIndex = focusableKeys.value.indexOf(key);
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

    return {
        focusIndex: readonly(focusIndex),
        currentFocusableKey,
        updateFocusIndex,
        getFocusableElement,
        addMouseMoveListener,
        removeMouseMoveListener,
    };
}
