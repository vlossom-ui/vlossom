<template>
    <div class="vs-confirm">
        <slot />

        <div class="vs-confirm-buttons">
            <vs-button
                ref="okRef"
                primary
                :color-scheme
                :style-set="componentStyleSet.okButton"
                @click.prevent.stop="ok"
            >
                {{ okText }}
            </vs-button>
            <vs-button
                ref="cancelRef"
                :color-scheme
                :style-set="componentStyleSet.cancelButton"
                @click.prevent.stop="cancel"
            >
                {{ cancelText }}
            </vs-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VsComponent, CONFIRM_OK, CONFIRM_CANCEL } from '@/declaration';
import { useOverlayCallbackStore } from '@/stores';
import { useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsConfirmStyleSet } from './types';

import VsButton from '@/components/vs-button/VsButton.vue';

const name = VsComponent.VsConfirm;

export default defineComponent({
    name,
    components: { VsButton },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsConfirmStyleSet>(),

        okText: { type: String, default: 'OK' },
        cancelText: { type: String, default: 'Cancel' },
    },
    setup(props) {
        const { styleSet } = toRefs(props);

        const overlayCallback = useOverlayCallbackStore();

        const { componentStyleSet } = useStyleSet<VsConfirmStyleSet>(name, styleSet);

        async function ok() {
            const id = overlayCallback.getLastOverlayId();
            await overlayCallback.run<boolean>(id, CONFIRM_OK);
        }

        async function cancel() {
            const id = overlayCallback.getLastOverlayId();
            await overlayCallback.run<boolean>(id, CONFIRM_CANCEL);
        }

        return { componentStyleSet, ok, cancel };
    },
});
</script>

<style src="./VsConfirm.css" />
