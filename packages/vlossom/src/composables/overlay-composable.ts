import { computed, type Ref, ref, watch } from 'vue';
import { useOverlayCallbackStore } from '@/stores';
import { stringUtil } from '@/utils';
import { VS_ANIMATION_DURATION, type OverlayCallbacks } from '@/declaration';

export function useOverlay(id: Ref<string>, callbacks: Ref<OverlayCallbacks> = ref({}), escClose: Ref<boolean>) {
    const innerId = stringUtil.createID();
    const overlayId = computed(() => id.value || innerId);
    const overlayCallbackStore = useOverlayCallbackStore();

    const isOpen = ref(false);
    const closing = ref(false);

    function open() {
        isOpen.value = true;
    }

    function close() {
        isOpen.value = false;
    }

    const computedCallbacks = computed(() => {
        return {
            ...callbacks.value,
            'key-Escape': () => {
                callbacks.value['key-Escape']?.();
                if (escClose.value) {
                    close();
                }
            },
        };
    });

    watch(isOpen, (o) => {
        if (o) {
            overlayCallbackStore.push(overlayId.value, computedCallbacks);
        } else {
            closing.value = true;
            overlayCallbackStore.remove(overlayId.value);

            setTimeout(() => {
                closing.value = false;
            }, VS_ANIMATION_DURATION);
        }
    });

    return { overlayId, isOpen, closing, open, close };
}
