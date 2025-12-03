import { computed, type Ref, ref, watch } from 'vue';
import { useOverlayCallbackStore } from '@/stores';
import { stringUtil } from '@/utils';
import { ANIMATION_DURATION, type OverlayCallbacks } from '@/declaration';

export function useOverlay(id: Ref<string>, callbacks: Ref<OverlayCallbacks> = ref({})) {
    const innerId = stringUtil.createID();
    const overlayId = computed(() => id.value || innerId);
    const overlayCallbackStore = useOverlayCallbackStore();

    const isMounted = ref(false);
    const isUnmounting = ref(false);

    function mountOverlay() {
        isMounted.value = true;
    }

    function unmountOverlay() {
        isMounted.value = false;
    }

    watch(isMounted, (o) => {
        if (o) {
            overlayCallbackStore.push(overlayId.value, callbacks);
        } else {
            isUnmounting.value = true;
            overlayCallbackStore.remove(overlayId.value);

            setTimeout(() => {
                isUnmounting.value = false;
            }, ANIMATION_DURATION);
        }
    });

    return { overlayId, isMounted, isUnmounting, mountOverlay, unmountOverlay };
}
