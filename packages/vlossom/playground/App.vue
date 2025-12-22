<template>
    <vs-layout class="flex min-h-screen flex-col">
        <vs-header position="sticky" :style-set="basicBarStyleSet">
            <div class="flex h-full items-center justify-between px-8">
                <h1 class="text-xl font-semibold">Vlossom Playground</h1>
                <vs-theme-button />
            </div>
        </vs-header>

        <vs-container class="mb-8 flex-1 pr-96">
            <vs-page class="mx-auto w-full max-w-4xl">
                <vs-tabs v-model="activeTab" :tabs="tabs" primary class="mb-8" />

                <vs-index-view v-model="activeTab" keep-alive>
                    <Basic />
                    <InputsAndForm />
                    <DataDisplay />
                    <Overlay />
                    <Sandbox />
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
        const tabs = ['Basic', 'Form', 'Data Display', 'Overlay', 'Sandbox'];
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
