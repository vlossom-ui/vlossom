<template>
    <div class="vs-layout">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_PROVIDED_KEY, LAYOUT_STORE_KEY, VsComponent } from '@/declaration';

const componentName = VsComponent.VsLayout;
export default defineComponent({
    name: componentName,
    setup() {
        const layoutStore = LayoutStore.getDefaultLayoutStore();

        provide(LAYOUT_STORE_KEY, layoutStore);
        provide(LAYOUT_PROVIDED_KEY, true);

        return {};
    },
});
</script>

<style src="./VsLayout.css" />
