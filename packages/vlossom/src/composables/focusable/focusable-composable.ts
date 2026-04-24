import { readonly, ref, watch, type DeepReadonly, type Ref, type TemplateRef } from 'vue';
import { functionUtil } from '@/utils';

export function useFocusable(wrapperElement: TemplateRef<HTMLElement>): {
    focusIndex: DeepReadonly<Ref<number>>;
    currentFocusableElement: DeepReadonly<Ref<HTMLElement | null>>;
    updateFocusIndex: (index: number) => void;
    getFocusableElements: () => HTMLElement[];
    addMouseMoveListener: () => void;
    removeMouseMoveListener: () => void;
} {
    const focusIndex = ref(-1);
    const currentFocusableElement = ref<HTMLElement | null>(null);

    function getFocusableElements() {
        const focusableElements = wrapperElement.value?.querySelectorAll<HTMLElement>('[data-focusable]');
        if (!focusableElements) {
            return [];
        }

        return Array.from(focusableElements);
    }

    function updateFocusIndex(index: number) {
        if (index < 0) {
            focusIndex.value = -1;
            return;
        }

        const focusableElements = getFocusableElements();
        if (index >= focusableElements.length) {
            focusIndex.value = focusableElements.length - 1;
            return;
        }

        focusIndex.value = index;
    }

    function trackMouseMove(event: MouseEvent) {
        if (!wrapperElement.value) {
            return;
        }

        const targetElement: HTMLElement | null = (event.target as HTMLElement).closest('[data-focusable]');

        if (!targetElement || targetElement === currentFocusableElement.value) {
            return;
        }

        const focusableElements = getFocusableElements();

        const targetIndex = focusableElements.indexOf(targetElement);
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

    return {
        focusIndex: readonly(focusIndex),
        currentFocusableElement: readonly(currentFocusableElement),
        updateFocusIndex,
        getFocusableElements,
        addMouseMoveListener,
        removeMouseMoveListener,
    };
}
