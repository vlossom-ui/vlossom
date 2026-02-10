<template>
    <vs-layout class="flex min-h-screen flex-col">
        <vs-header position="sticky" :style-set="basicBarStyleSet">
            <div class="flex h-full items-center justify-between px-8">
                <div class="flex items-center gap-2">
                    <vs-image src="/assets/vlossom-logo.png" :style-set="{ height: '36px', width: '36px' }" />
                    <h1 class="text-2xl font-bold">Vlossom Playground</h1>
                </div>
                <div class="flex items-center gap-2">
                    <vs-theme-button />
                    <ColorSchemePanelButton />
                </div>
            </div>
        </vs-header>

        <vs-container class="flex-1 pb-32 lg:pr-96">
            <vs-page class="w-full" :style-set="{ padding: '0 2rem' }">
                <vs-tabs v-model="activeTab" :tabs="tabs" primary class="mb-8" />

                <vs-index-view v-model="activeTab" keep-alive>
                    <vs-page class="mb-8" :style-set="{ padding: '0' }">
                        <template #title>
                            <h2 class="mb-2 border-b-2 pb-2 text-2xl font-semibold">Sandbox</h2>
                        </template>
                        <Sandbox />
                    </vs-page>
                    <Basic />
                    <Inputs />
                    <DataDisplay />
                    <Overlay />
                    <FormExample />
                    <ColorPalette />
                </vs-index-view>
            </vs-page>

            <ColorSchemePanel class="fixed top-20 right-24 hidden lg:block" />
        </vs-container>

        <vs-footer :style-set="basicBarStyleSet">
            <div class="flex h-full items-center justify-center text-sm">
                <span>© 2026 Vlossom</span>
            </div>
        </vs-footer>
    </vs-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Basic from './views/Basic.vue';
import Inputs from './views/Inputs.vue';
import DataDisplay from './views/DataDisplay.vue';
import Overlay from './views/Overlay.vue';
import Sandbox from './Sandbox.vue';
import FormExample from './components/FormExample.vue';
import ColorPalette from './views/ColorPalette.vue';
import ColorSchemePanel from './components/ColorSchemePanel.vue';
import ColorSchemePanelButton from './components/ColorSchemePanelButton.vue';
import type { VsBarStyleSet } from '@/components/vs-bar/types';

export default defineComponent({
    name: 'App',
    components: {
        Basic,
        Inputs,
        DataDisplay,
        Overlay,
        Sandbox,
        FormExample,
        ColorSchemePanel,
        ColorSchemePanelButton,
        ColorPalette,
    },
    setup() {
        const tabs = ['Sandbox', 'Basic', 'Inputs', 'Data Display', 'Overlay', 'Form Example', 'Color Palette'];
        const activeTab = ref(0);

        const basicBarStyleSet: VsBarStyleSet = {
            border: 'none',
            backgroundColor: 'black',
            fontColor: 'white',
        };

        return {
            tabs,
            activeTab,
            basicBarStyleSet,
        };
    },
});
</script>

<style>
#app {
    font-family:
        'Pretendard',
        -apple-system,
        BlinkMacSystemFont,
        system-ui,
        sans-serif;
}
</style>
