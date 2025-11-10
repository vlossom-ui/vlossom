import { ref } from 'vue';
import { domUtil, deviceUtil } from '@/utils';

interface ScrollLockState {
    overflow: string;
    paddingRight: string;
    paddingBottom: string;
}

export function useScrollLock(element: HTMLElement | null) {
    const originalState = ref<ScrollLockState>({
        overflow: '',
        paddingRight: '0',
        paddingBottom: '0',
    });
    const scrollbarWidth = '10px';
    const isNotTouchDevice = !(domUtil.isBrowser() && deviceUtil.isTouchDevice());

    function saveOriginalState() {
        if (!element) {
            return;
        }

        originalState.value = {
            overflow: element.style.overflow,
            paddingRight: element.style.paddingRight,
            paddingBottom: element.style.paddingBottom,
        };
    }

    function applyScrollLockStyles() {
        if (!element) {
            return;
        }

        element.style.overflow = 'hidden';

        if (isNotTouchDevice) {
            if (element.scrollHeight >= element.clientHeight) {
                element.style.paddingRight = scrollbarWidth;
            }
            if (element.scrollWidth >= element.clientWidth) {
                element.style.paddingBottom = scrollbarWidth;
            }
        }
    }

    function restoreOriginalState() {
        if (!element) {
            return;
        }

        element.style.overflow = originalState.value.overflow;
        element.style.paddingRight = originalState.value.paddingRight;
        element.style.paddingBottom = originalState.value.paddingBottom;
    }

    function lock() {
        if (!element) {
            return;
        }

        saveOriginalState();
        requestAnimationFrame(applyScrollLockStyles);
    }

    function unlock() {
        if (!element) {
            return;
        }

        requestAnimationFrame(restoreOriginalState);
    }

    return {
        lock,
        unlock,
    };
}
