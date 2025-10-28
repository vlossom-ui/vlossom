<template>
    <div id="vs-overlay-wrapper">
        <template v-for="view in overlayViews" :key="view.container">
            <Teleport :to="view.container">
                <component :is="view.component" />
            </Teleport>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';

export default defineComponent({
    name: 'OverlayWrapper',
    setup() {
        const overlayViews: Ref<any[]> = ref([{ container: 'body', component: 'VsToastView' }]);

        return {
            overlayViews,
        };
    },
});
</script>
