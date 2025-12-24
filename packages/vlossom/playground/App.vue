<template>
    <vs-layout class="flex min-h-screen flex-col">
        <vs-header position="sticky" :style-set="basicBarStyleSet">
            <div class="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
                <div class="flex items-center gap-2">
                    <vs-image src="/assets/vlossom-logo.png" :style-set="{ height: '36px', width: '36px' }" />
                    <h1 class="text-2xl font-bold">Vlossom Playground</h1>
                </div>
                <vs-theme-button />
            </div>
        </vs-header>

        <vs-container class="flex-1 pr-96 pb-32">
            <vs-page class="mx-auto w-full max-w-4xl" :style-set="{ padding: '0 2rem' }">
                <vs-tabs v-model="activeTab" :tabs="tabs" primary class="mb-8" />

                <vs-index-view v-model="activeTab" keep-alive>
                    <section class="mb-8">
                        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Sandbox</h2>
                        <Sandbox />
                    </section>
                    <Basic />
                    <InputsAndForm />
                    <DataDisplay />
                    <Overlay />
                </vs-index-view>
            </vs-page>

            <ColorSchemePanel />
        </vs-container>

        <vs-footer :style-set="basicBarStyleSet">
            <div class="flex h-full items-center justify-center text-sm">
                <span>© 2025 Vlossom</span>
            </div>
        </vs-footer>
    </vs-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Basic from './views/Basic.vue';
import InputsAndForm from './views/InputsAndForm.vue';
import DataDisplay from './views/DataDisplay.vue';
import Overlay from './views/Overlay.vue';
import Sandbox from './Sandbox.vue';
import ColorSchemePanel from './components/ColorSchemePanel.vue';
import type { VsBarStyleSet } from '@/components/vs-bar/types';

export default defineComponent({
    name: 'App',
    components: {
        Basic,
        InputsAndForm,
        DataDisplay,
        Overlay,
        Sandbox,
        ColorSchemePanel,
    },
    setup() {
        const tabs = ['Sandbox', 'Basic', 'Form', 'Data Display', 'Overlay'];
        const activeTab = ref(0);
        const isPanelCollapsed = ref(false);
        const basicBarStyleSet: VsBarStyleSet = {
            border: 'none',
            backgroundColor: 'black',
            fontColor: 'white',
        };

        return {
            tabs,
            activeTab,
            isPanelCollapsed,
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
