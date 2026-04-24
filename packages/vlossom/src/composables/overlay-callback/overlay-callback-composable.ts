import { computed, type Ref, ref, watch } from 'vue';
import { useOverlayCallbackStore } from '@/stores';
import { stringUtil } from '@/utils';
import { ANIMATION_DURATION, type OverlayCallbacks } from '@/declaration';

export function useOverlayCallback(id: Ref<string>, callbacks: Ref<OverlayCallbacks> = ref({})) {
    const innerId = stringUtil.createID();
    const overlayId = computed(() => id.value || innerId);
    const overlayCallbackStore = useOverlayCallbackStore();

    const isActivated = ref(false);
    const isUnmounting = ref(false);

    function activate() {
        isActivated.value = true;
    }

    function deactivate() {
        isActivated.value = false;
    }

    watch(isActivated, (o) => {
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

    return { overlayId, isActivated, isUnmounting, activate, deactivate };
}
