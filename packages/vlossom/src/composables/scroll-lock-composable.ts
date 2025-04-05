import { ref } from 'vue';
import { SCROLLBAR_WIDTH } from '@/declaration';

// TODO: element가 Ref일 필요가 있을지 검토 (PUBG-231196와 연관 있나)
export function useScrollLock(element: HTMLElement | null) {
    const originalOverflow = ref('');
    const originalPaddingRight = ref('0');
    const originalPaddingBottom = ref('0');

    function lock() {
        if (!element) {
            return;
        }
        setTimeout(() => {
            originalOverflow.value = element.style.overflow;
            originalPaddingRight.value = element.style.paddingRight;
            originalPaddingBottom.value = element.style.paddingBottom;

            if (element.scrollHeight >= element.clientHeight) {
                element.style.paddingRight = SCROLLBAR_WIDTH;
            }

            if (element.scrollWidth >= element.clientWidth) {
                element.style.paddingBottom = SCROLLBAR_WIDTH;
            }

            element.style.overflow = 'hidden';
        }, 10);
    }

    function unlock() {
        if (!element) {
            return;
        }
        setTimeout(() => {
            element.style.overflow = originalOverflow.value;
            element.style.paddingRight = originalPaddingRight.value;
            element.style.paddingBottom = originalPaddingBottom.value;
        }, 10);
    }

    return {
        lock,
        unlock,
    };
}
