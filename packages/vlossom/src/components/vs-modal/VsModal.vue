<template>
    <Teleport :to="container" :disabled="!container || container === 'body'">
        <vs-modal-node
            :color-scheme="colorScheme"
            :style-set="styleSet"
            :container="container"
            :dim-close="dimClose"
            :dimmed="dimmed"
            :esc-close="escClose"
            :focus-lock="focusLock"
            :id="id"
            :initial-focus-ref="initialFocusRef"
            :size="size"
            :callbacks="callbacks"
            :scroll-lock="scrollLock"
            @close="onClose"
        >
            <slot />
        </vs-modal-node>
    </Teleport>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { getOverlayProps } from '@/props';
import VsModalNode from '@/components/vs-modal/VsModalNode.vue';
import type { VsModalNodeStyleSet } from './types';

const name = VsComponent.VsModal;
export default defineComponent({
    name,
    components: { VsModalNode },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsModalNodeStyleSet>(),
        ...getOverlayProps(),
        container: { type: String, default: 'body' },
        size: {
            type: [String, Number, Object],
        },
        initialFocusRef: { type: Object, default: null },
    },
    emits: ['update:modelValue', 'close'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, dimClose, escClose, focusLock, id, callbacks, scrollLock } = toRefs(props);

        function onClose() {
            emit('close');
            emit('update:modelValue', false);
        }

        return {
            colorScheme,
            styleSet,
            dimClose,
            escClose,
            focusLock,
            id,
            callbacks,
            scrollLock,
            onClose,
        };
    },
});
</script>
