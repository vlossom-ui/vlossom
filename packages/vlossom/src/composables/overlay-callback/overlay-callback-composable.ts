import { computed, onScopeDispose, type Ref, ref, watch } from 'vue';
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

    // 활성 상태로 언마운트되면 watch가 함께 정리되어 deactivate 경로가 실행되지 않으므로 스토어에서 직접 제거한다
    onScopeDispose(() => {
        if (isActivated.value) {
            overlayCallbackStore.remove(overlayId.value);
        }
    }, true);

    return { overlayId, isActivated, isUnmounting, activate, deactivate };
}
