import {
    computed,
    readonly,
    ref,
    watch,
    type ComputedRef,
    type DeepReadonly,
    type Ref,
    type TemplateRef,
} from 'vue';
import { functionUtil } from '@/utils';

interface UseFocusableReturn {
    focusIndex: DeepReadonly<Ref<number>>;
    /** The rendered element for the current position in DOM-order mode. */
    currentFocusableElement: DeepReadonly<Ref<HTMLElement | null>>;
    /** The logical key at focusIndex. Null means nothing is focused. */
    currentFocusableKey: ComputedRef<string | null>;
    updateFocusIndex: (index: number) => void;
    getFocusableElements: () => HTMLElement[];
    getFocusableElement: (key: string) => HTMLElement | null;
    addMouseMoveListener: () => void;
    removeMouseMoveListener: () => void;
}

/**
 * Tracks focus either by the DOM order (legacy/general-purpose mode) or by a
 * caller-provided logical key list (virtualized mode).
 *
 * Keeping the key list optional is intentional: consumers that only render a
 * normal DOM list retain the original API, while virtualized consumers can
 * navigate items that are not currently mounted.
 */
export function useFocusable(
    wrapperElement: TemplateRef<HTMLElement>,
    focusableKeys?: Ref<string[]>,
): UseFocusableReturn {
    const focusIndex = ref(-1);
    const currentFocusableElement = ref<HTMLElement | null>(null);
    const isKeyBased = focusableKeys !== undefined;

    function getFocusableElements(): HTMLElement[] {
        const elements = wrapperElement.value?.querySelectorAll<HTMLElement>('[data-focusable]');
        return elements ? Array.from(elements) : [];
    }

    function getFocusableElement(key: string): HTMLElement | null {
        return getFocusableElements().find((element) => element.dataset['focusable'] === key) ?? null;
    }

    function getFocusableCount() {
        return isKeyBased ? focusableKeys.value.length : getFocusableElements().length;
    }

    const currentFocusableKey = computed(() => {
        if (focusIndex.value < 0) {
            return null;
        }

        if (isKeyBased) {
            return focusableKeys.value[focusIndex.value] ?? null;
        }

        return currentFocusableElement.value?.dataset['focusable'] ?? null;
    });

    function updateFocusIndex(index: number) {
        if (index < 0) {
            focusIndex.value = -1;
            return;
        }

        focusIndex.value = Math.min(index, getFocusableCount() - 1);
    }

    function syncCurrentFocusableElement() {
        const previous = currentFocusableElement.value;
        if (!isKeyBased && previous) {
            previous.classList.remove('vs-focusable-active');
        }

        if (focusIndex.value < 0) {
            currentFocusableElement.value = null;
            return;
        }

        const target = isKeyBased
            ? getFocusableElement(focusableKeys.value[focusIndex.value])
            : getFocusableElements()[focusIndex.value] ?? null;

        currentFocusableElement.value = target;
        if (!isKeyBased && target) {
            target.classList.add('vs-focusable-active');
        }
    }

    if (focusableKeys) {
        // Key mode does not need to scan the DOM on every arrow key. The
        // caller can resolve a rendered element explicitly when needed.
        watch(
            focusableKeys,
            () => {
                if (focusIndex.value >= focusableKeys.value.length) {
                    focusIndex.value = focusableKeys.value.length - 1;
                }
            },
            { flush: 'post' },
        );
    } else {
        // Preserve the original DOM-order behavior, including the active CSS
        // class and currentFocusableElement ref.
        watch(focusIndex, syncCurrentFocusableElement, { flush: 'post' });
    }

    function trackMouseMove(event: MouseEvent) {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const targetElement = target.closest<HTMLElement>('[data-focusable]');
        if (!targetElement) {
            return;
        }

        if (isKeyBased) {
            const key = targetElement.dataset['focusable'];
            if (!key || key === currentFocusableKey.value) {
                return;
            }

            const targetIndex = focusableKeys.value.indexOf(key);
            if (targetIndex !== -1) {
                updateFocusIndex(targetIndex);
            }
            return;
        }

        const targetIndex = getFocusableElements().indexOf(targetElement);
        if (targetIndex !== -1 && targetIndex !== focusIndex.value) {
            updateFocusIndex(targetIndex);
        }
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
        currentFocusableElement: readonly(currentFocusableElement),
        currentFocusableKey,
        updateFocusIndex,
        getFocusableElements,
        getFocusableElement,
        addMouseMoveListener,
        removeMouseMoveListener,
    };
}
