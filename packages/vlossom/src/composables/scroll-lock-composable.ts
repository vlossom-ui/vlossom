import { ref } from 'vue';
import { domUtil, deviceUtil } from '@/utils';

interface ScrollLockState {
    overflow: string;
    paddingRight: string;
    paddingBottom: string;
}

export function useScrollLock(container: string = 'body') {
    const containerElement: HTMLElement | null = document.querySelector(container);

    const isLocked = ref(false);

    const originalState = ref<ScrollLockState>({
        overflow: '',
        paddingRight: '0',
        paddingBottom: '0',
    });
    const scrollbarWidth = '8px';
    const isNotTouchDevice = !(domUtil.isBrowser() && deviceUtil.isTouchDevice());

    function saveOriginalState() {
        if (!containerElement) {
            return;
        }

        originalState.value = {
            overflow: containerElement.style.overflow,
            paddingRight: containerElement.style.paddingRight,
            paddingBottom: containerElement.style.paddingBottom,
        };
    }

    function applyScrollLockStyles() {
        if (!containerElement) {
            return;
        }

        containerElement.style.overflow = 'hidden';

        if (isNotTouchDevice) {
            if (containerElement.scrollHeight >= containerElement.clientHeight) {
                containerElement.style.paddingRight = scrollbarWidth;
            }
            if (containerElement.scrollWidth >= containerElement.clientWidth) {
                containerElement.style.paddingBottom = scrollbarWidth;
            }
        }
    }

    function restoreOriginalState() {
        if (!containerElement) {
            return;
        }

        containerElement.style.overflow = originalState.value.overflow;
        containerElement.style.paddingRight = originalState.value.paddingRight;
        containerElement.style.paddingBottom = originalState.value.paddingBottom;
    }

    function lock() {
        if (!containerElement || isLocked.value) {
            return;
        }

        saveOriginalState();
        isLocked.value = true;
        requestAnimationFrame(applyScrollLockStyles);
    }

    function unlock() {
        if (!containerElement || !isLocked.value) {
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
