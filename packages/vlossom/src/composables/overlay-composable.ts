import { computed, type Ref, ref, watch } from 'vue';
import { utils } from '@/utils';
import { MODAL_DURATION, type EventCallbacks } from '@/declaration';
import { useVlossom } from '@/vlossom-framework';

export function useOverlay(id: Ref<string>, callbacks: Ref<EventCallbacks> = ref({}), escClose: Ref<boolean>) {
    const $vs = useVlossom();
    const innerId = utils.string.createID();
    const overlayId = computed(() => id.value || innerId);

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
            $vs.stores.overlay.push(overlayId.value, computedCallbacks);
        } else {
            closing.value = true;
            $vs.stores.overlay.remove(overlayId.value);

            setTimeout(() => {
                closing.value = false;
            }, MODAL_DURATION);
        }
    });

    return { overlayId, isOpen, closing, open, close };
}
