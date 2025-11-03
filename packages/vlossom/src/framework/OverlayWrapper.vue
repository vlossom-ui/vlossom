<template>
    <div id="vs-overlay-wrapper">
        <template v-for="view in overlayViews" :key="view.container">
            <Teleport :to="view.container">
                <component :is="view.component" :container="view.container" />
            </Teleport>
        </template>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useOverlayContainerStore } from '@/stores';

export default defineComponent({
    name: 'OverlayWrapper',
    setup() {
        const overlayContainerStore = useOverlayContainerStore();

        const overlayViews = computed(() => Array.from(overlayContainerStore.overlayViewMap.value.values()));

        return {
            overlayViews,
        };
    },
});
</script>
