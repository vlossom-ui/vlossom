import { computed, ref, type ComputedRef } from 'vue';
import { domUtil, deviceUtil } from '@/utils';

interface ScrollLockState {
    overflow: string;
    paddingRight: string;
    paddingBottom: string;
}

export function useScrollLock(container: string = 'body') {
    const containerElement: ComputedRef<HTMLElement | null> = computed(() => {
        if (container === 'body') {
            return document.body;
        }

        return document.querySelector(container);
    });

    const isLocked = ref(false);

    const originalState = ref<ScrollLockState>({
        overflow: '',
        paddingRight: '0',
        paddingBottom: '0',
    });
    const scrollbarWidth = '8px';
    const isNotTouchDevice = !(domUtil.isBrowser() && deviceUtil.isTouchDevice());

    function saveOriginalState() {
        if (!containerElement.value) {
            return;
        }

        originalState.value = {
            overflow: containerElement.value.style.overflow,
            paddingRight: containerElement.value.style.paddingRight,
            paddingBottom: containerElement.value.style.paddingBottom,
        };
    }

    function applyScrollLockStyles() {
        if (!containerElement.value) {
            return;
        }

        containerElement.value.style.overflow = 'hidden';

        if (isNotTouchDevice) {
            if (containerElement.value.scrollHeight >= containerElement.value.clientHeight) {
                containerElement.value.style.paddingRight = scrollbarWidth;
            }
            if (containerElement.value.scrollWidth >= containerElement.value.clientWidth) {
                containerElement.value.style.paddingBottom = scrollbarWidth;
            }
        }
    }

    function restoreOriginalState() {
        if (!containerElement.value) {
            return;
        }

        containerElement.value.style.overflow = originalState.value.overflow;
        containerElement.value.style.paddingRight = originalState.value.paddingRight;
        containerElement.value.style.paddingBottom = originalState.value.paddingBottom;
    }

    function lock() {
        if (!containerElement.value || isLocked.value) {
            return;
        }

        saveOriginalState();
        isLocked.value = true;
        requestAnimationFrame(applyScrollLockStyles);
    }

    function unlock() {
        if (!containerElement.value || !isLocked.value) {
            return;
        }

        isLocked.value = false;
        requestAnimationFrame(restoreOriginalState);
    }

    return {
        isLocked,
        lock,
        unlock,
    };
}
