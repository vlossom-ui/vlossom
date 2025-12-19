<template>
    <vs-layout class="flex min-h-screen flex-col">
        <vs-header position="sticky">
            <div class="header-content">
                <h1 class="header-title">Vlossom Playground</h1>
                <vs-theme-button />
            </div>
        </vs-header>

        <vs-page class="flex-1">
            <vs-tabs v-model="activeTab" :tabs="tabs" primary style="margin-bottom: 2rem" />

            <Basic v-show="activeTab === 0" />
            <InputsAndForm v-show="activeTab === 1" />
            <DataDisplay v-show="activeTab === 2" />
            <Overlay v-show="activeTab === 3" />
            <Sandbox v-show="activeTab === 4" />
        </vs-page>

        <vs-footer>
            <div class="footer-content">
                <span>Vlossom Component Library</span>
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

export default defineComponent({
    name: 'App',
    components: {
        Basic,
        InputsAndForm,
        DataDisplay,
        Overlay,
        Sandbox,
    },
    setup() {
        const tabs = ['Basic', 'Form', 'Data Display', 'Overlay', 'Sandbox'];
        const activeTab = ref(0);

        return {
            tabs,
            activeTab,
        };
    },
});
</script>

<style>
.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 1.5rem;
    height: 100%;
}

.header-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.footer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 0.875rem;
}
</style>
