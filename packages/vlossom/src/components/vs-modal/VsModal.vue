<script lang="ts">
import {
    defineComponent,
    ref,
    toRefs,
    watch,
    computed,
    onActivated,
    onBeforeUnmount,
    onDeactivated,
    onMounted,
    type Component,
    type PropType,
} from 'vue';
import { VsComponent, OVERLAY_CLOSE, type SizeProp } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { getOverlayProps } from '@/props';
import type { VsModalNodeStyleSet } from './types';
import { useVlossom } from '@/framework';
import { useModalContainerStore, useOverlayCallbackStore } from '@/stores';

const componentName = VsComponent.VsModal;
export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsModalNodeStyleSet>(),
        ...getOverlayProps(),
        beforeClose: {
            type: Function as PropType<() => Promise<boolean> | boolean>,
            default: undefined,
        },
        container: { type: String, default: 'body' },
        escClose: { type: Boolean, default: false },
        scrollLock: { type: [Boolean, String] as PropType<boolean | string>, default: false },
        size: {
            type: [String, Number, Object] as PropType<SizeProp | { width?: SizeProp; height?: SizeProp }>,
        },

        // v-model
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'open', 'close'],
    inheritAttrs: false,
    setup(props, { emit, slots }) {
        const $vs = useVlossom();
        const modalStore = useModalContainerStore();
        const overlayCallbackStore = useOverlayCallbackStore();
        const { modelValue, callbacks } = toRefs(props);

        const isOpen = ref(modelValue.value);
        const modalId = ref('');

        const modalOptions = computed(() => {
            return {
                ...props,
                callbacks: {
                    ...callbacks.value,
                    [OVERLAY_CLOSE]: () => {
                        // detachModal()이 modalId를 먼저 비우므로, 언마운트/비활성화로 인한 제거는 v-model 상태를 바꾸지 않는다
                        if (modalId.value) {
                            isOpen.value = false;
                        }
                    },
                },
            };
        });

        watch(modelValue, async (o) => {
            if (o === isOpen.value) {
                return;
            }
            if (!o) {
                const closed = await $vs.modal.closeWithId(modalId.value);
                if (!closed) {
                    emit('update:modelValue', true);
                }
                return;
            }
            isOpen.value = true;
        });

        function openModal() {
            if (modalId.value) {
                return;
            }
            const modalComponent: Component = () => slots.default?.() ?? null;
            modalId.value = $vs.modal.open(modalComponent, modalOptions.value);
        }

        // 컴포넌트가 사라지면 beforeClose로 막을 주체가 없으므로 beforeClose 없이 스토어에서 바로 제거한다
        function detachModal() {
            const id = modalId.value;
            if (!id) {
                return;
            }
            modalId.value = '';
            overlayCallbackStore.remove(id);
            modalStore.remove(modalOptions.value.container, id);
        }

        watch(isOpen, (o) => {
            emit('update:modelValue', o);
            emit(o ? 'open' : 'close');

            if (o) {
                openModal();
            } else {
                modalId.value = '';
            }
        });

        onMounted(() => {
            if (isOpen.value) {
                openModal();
                emit('open');
            }
        });

        onActivated(() => {
            if (isOpen.value) {
                openModal();
            }
        });

        onDeactivated(detachModal);
        onBeforeUnmount(detachModal);

        return () => null;
    },
});
</script>
