<template>
    <vs-modal
        :container
        :esc-close
        :size
        :color-scheme
        :dim-close
        :dimmed
        :focus-lock
        :hide-scroll
        :scroll-lock
        :style-set="componentStyleSet.container"
    >
        <div class="vs-confirm">
            <slot />

            <div class="vs-confirm-buttons">
                <vs-button
                    ref="okRef"
                    primary
                    :color-scheme="colorScheme"
                    :style-set="componentStyleSet.okButton"
                    @click.prevent.stop="ok"
                >
                    {{ okText }}
                </vs-button>
                <vs-button
                    ref="cancelRef"
                    :color-scheme="colorScheme"
                    :style-set="componentStyleSet.cancelButton"
                    @click.prevent.stop="cancel"
                >
                    {{ cancelText }}
                </vs-button>
            </div>
        </div>
    </vs-modal>
</template>

<script lang="ts">
import { defineComponent, toRefs, type PropType } from 'vue';
import { VsComponent, CONFIRM_OK, CONFIRM_CANCEL, type SizeProp } from '@/declaration';
import { useOverlayCallbackStore } from '@/stores';
import { useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsConfirmStyleSet } from './types';

import VsButton from '@/components/vs-button/VsButton.vue';
import VsModal from '@/components/vs-modal/VsModal.vue';

const name = VsComponent.VsConfirm;

export default defineComponent({
    name,
    components: { VsButton, VsModal },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsConfirmStyleSet>(),
        container: { type: String, default: 'body' },
        // partial of getOverlayProps
        dimClose: { type: Boolean, default: false },
        dimmed: { type: Boolean, default: false },
        focusLock: { type: Boolean, default: false },
        hideScroll: { type: Boolean, default: false },
        scrollLock: { type: Boolean, default: false },
        escClose: { type: Boolean, default: true },
        size: {
            type: [String, Number, Object] as PropType<SizeProp | { width?: SizeProp; height?: SizeProp }>,
        },
        okText: { type: String, default: 'OK' },
        cancelText: { type: String, default: 'Cancel' },
    },
    emits: ['update:modelValue', 'ok', 'cancel'],
    setup(props, { emit }) {
        const { styleSet } = toRefs(props);

        const overlayCallback = useOverlayCallbackStore();

        const { componentStyleSet } = useStyleSet<VsConfirmStyleSet>(name, styleSet);

        async function ok() {
            const id = overlayCallback.getLastOverlayId();
            const resolved = (await overlayCallback.run<boolean>(id, CONFIRM_OK)) === true;
            if (resolved) {
                emit('ok');
            }
        }

        async function cancel() {
            const id = overlayCallback.getLastOverlayId();
            const resolved = (await overlayCallback.run<boolean>(id, CONFIRM_CANCEL)) === false;
            if (resolved) {
                emit('cancel');
            }
        }

        return { componentStyleSet, ok, cancel };
    },
});
</script>

<style src="./VsConfirm.css" />
