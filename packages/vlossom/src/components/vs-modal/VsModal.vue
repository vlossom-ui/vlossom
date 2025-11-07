<script lang="ts">
import { defineComponent, ref, toRefs, watch, computed, type Component, type PropType } from 'vue';
import { VsComponent, OVERLAY_CLOSE, type SizeProp } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { getOverlayProps } from '@/props';
import type { VsModalNodeStyleSet } from './types';
import { useVlossom } from '@/framework';

const name = VsComponent.VsModal;
export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsModalNodeStyleSet>(),
        ...getOverlayProps(),
        container: { type: String, default: 'body' },
        escClose: { type: Boolean, default: true },
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
        const { modelValue, container, callbacks } = toRefs(props);

        const isOpen = ref(modelValue.value);
        const modalId = ref('');

        watch(modelValue, (o) => {
            isOpen.value = o;
        });

        const modalOptions = computed(() => {
            return {
                ...props,
                callbacks: {
                    ...callbacks.value,
                    [OVERLAY_CLOSE]: () => {
                        isOpen.value = false;
                    },
                },
            };
        });

        watch(isOpen, (o) => {
            emit('update:modelValue', o);
            emit(o ? 'open' : 'close');

            if (o) {
                const vnode = slots.default?.();
                const modalComponent: Component = vnode ? () => vnode : ((() => null) as Component);
                modalId.value = $vs.modal.open(modalComponent, modalOptions.value);
            } else {
                $vs.modal.closeWithId(container.value, modalId.value);
            }
        });

        return () => null;
    },
});
</script>
