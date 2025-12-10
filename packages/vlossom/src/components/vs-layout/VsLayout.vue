<template>
    <div class="vs-layout">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';

const componentName = VsComponent.VsLayout;
export default defineComponent({
    name: componentName,
    setup() {
        const layoutStore = LayoutStore.getDefaultLayoutStore();

        provide(LAYOUT_STORE_KEY, layoutStore);

        return {};
    },
});
</script>

<style src="./VsLayout.css" />
