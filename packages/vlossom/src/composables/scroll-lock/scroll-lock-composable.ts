import { ref } from 'vue';
import { useScrollLockStore } from '@/stores';
import { stringUtil } from '@/utils';

export function useScrollLock(container: string = 'body') {
    const containerElement: HTMLElement | null = document.querySelector(container);
    const ownerId = stringUtil.createID();
    const scrollLockStore = useScrollLockStore();

    const isLocked = ref(false);

    function lock() {
        if (!containerElement || isLocked.value) {
            return;
        }

        isLocked.value = true;
        scrollLockStore.lock(ownerId, containerElement);
    }

    function unlock() {
        if (!containerElement || !isLocked.value) {
            return;
        }

        isLocked.value = false;
        scrollLockStore.unlock(ownerId, containerElement);
    }

    return {
        isLocked,
        lock,
        unlock,
    };
}
