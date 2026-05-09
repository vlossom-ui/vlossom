<template>
    <div class="lg:hidden">
        <vs-button id="color-panel-btn" dense circle :style-set="buttonStyleSet" @click="togglePanel">
            <span class="text-lg">🎨</span>
        </vs-button>
        <vs-floating target="#color-panel-btn" v-model="isPanelOpen" placement="bottom" align="end">
            <ColorSchemePanel />
        </vs-floating>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ColorSchemePanel from './ColorSchemePanel.vue';
import type { VsButtonStyleSet } from '@/components/vs-button/types';

const buttonStyleSet: VsButtonStyleSet = {
    backgroundColor: 'transparent',
};

export default defineComponent({
    name: 'ColorSchemePanelButton',
    components: {
        ColorSchemePanel,
    },
    setup() {
        const isPanelOpen = ref(false);

        function togglePanel() {
            isPanelOpen.value = !isPanelOpen.value;
        }

        return {
            buttonStyleSet,
            isPanelOpen,
            togglePanel,
        };
    },
});
</script>
