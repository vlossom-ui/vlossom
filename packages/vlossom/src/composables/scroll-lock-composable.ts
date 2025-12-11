import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { domUtil, deviceUtil } from '@/utils';
import { useScrollLockStore } from '@/stores';

interface ScrollLockState {
    overflow: string;
    paddingRight: string;
    paddingBottom: string;
}

export function useScrollLock(container: Ref<string>, overlayId: Ref<string>) {
    const containerElement: ComputedRef<HTMLElement | null> = computed(() => {
        const containerValue = container.value || 'body';
        if (containerValue === 'body') {
            return document.body;
        }

        return document.querySelector(containerValue);
    });

    const scrollLockStore = useScrollLockStore();

    const originalState = ref<ScrollLockState>({
        overflow: '',
        paddingRight: '0',
        paddingBottom: '0',
    });
    const scrollbarWidth = '10px';
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
        if (!containerElement.value) {
            return;
        }

        scrollLockStore.add(container.value, overlayId.value);
        saveOriginalState();
        requestAnimationFrame(applyScrollLockStyles);
    }

    function unlock() {
        if (!containerElement.value) {
            return;
        }

        scrollLockStore.remove(container.value, overlayId.value);
        if (scrollLockStore.isLocked(container.value)) {
            return;
        }
        requestAnimationFrame(restoreOriginalState);
    }

    return {
        lock,
        unlock,
    };
}
