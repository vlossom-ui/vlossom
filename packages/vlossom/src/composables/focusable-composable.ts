import { onMounted, onUnmounted, readonly, ref, watch, type TemplateRef } from 'vue';
import { functionUtil } from '@/utils';

export function useFocusable(wrapperElement: TemplateRef<HTMLElement>) {
    const focusIndex = ref(-1);
    const currentFocusableElement = ref<HTMLElement | null>(null);

    function updateFocusIndex(index: number) {
        focusIndex.value = index;
    }

    function trackMouseMove(event: MouseEvent) {
        if (!wrapperElement.value) {
            return;
        }

        const targetElement = event.target as HTMLElement;
        if (!targetElement.hasAttribute('data-focusable')) {
            return;
        }

        const focusableElements = wrapperElement.value?.querySelectorAll<HTMLElement>('[data-focusable]');
        if (!focusableElements) {
            return;
        }

        const targetIndex = Array.from(focusableElements).indexOf(targetElement);
        if (targetIndex === -1) {
            return;
        }

        updateFocusIndex(targetIndex);
    }

    const throttledTrackMouseMove = functionUtil.throttle({ interval: 25 }, trackMouseMove);

    onMounted(() => {
        wrapperElement.value?.addEventListener('mousemove', throttledTrackMouseMove);
    });

    onUnmounted(() => {
        wrapperElement.value?.removeEventListener('mousemove', throttledTrackMouseMove);
    });

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

        const focusableElements = wrapperElement.value.querySelectorAll<HTMLElement>('[data-focusable]');
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
        updateFocusIndex,
    };
}
