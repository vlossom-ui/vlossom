<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Overlay Components</h2>

        <h3 class="mb-4 font-semibold">VsDrawer</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-button @click="drawerLeft = true">Left Drawer</vs-button>
            <vs-button @click="drawerRight = true">Right Drawer</vs-button>
            <vs-button @click="drawerTop = true">Top Drawer</vs-button>
            <vs-button @click="drawerBottom = true">Bottom Drawer</vs-button>
        </div>
        <vs-drawer v-model="drawerLeft" placement="left" dimmed dim-close>
            <template #header>
                <div class="p-4 font-bold">Left Drawer</div>
            </template>
            <div class="p-4">Drawer content here</div>
        </vs-drawer>
        <vs-drawer v-model="drawerRight" placement="right" dimmed dim-close>
            <template #header>
                <div class="p-4 font-bold">Right Drawer</div>
            </template>
            <div class="p-4">Drawer content here</div>
        </vs-drawer>
        <vs-drawer v-model="drawerTop" placement="top" dimmed dim-close size="200px">
            <div class="p-4">Top Drawer content</div>
        </vs-drawer>
        <vs-drawer v-model="drawerBottom" placement="bottom" dimmed dim-close size="200px">
            <div class="p-4">Bottom Drawer content</div>
        </vs-drawer>
        <Divider />

        <h3 class="mb-4 font-semibold">VsModal</h3>
        <vs-button @click="modalOpen = true">Open Modal</vs-button>
        <vs-modal v-model="modalOpen" :size="{ width: '500px', height: 'auto' }">
            <div class="p-8">
                <h3 class="mb-4">Modal Title</h3>
                <p class="mb-4">This is modal content. You can put anything here.</p>
                <vs-button @click="modalOpen = false">Close</vs-button>
            </div>
        </vs-modal>
        <Divider />

        <h3 class="mb-4 font-semibold">Toast Plugin</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-button @click="showToast('info')">Info Toast</vs-button>
            <vs-button @click="showToast('success')">Success Toast</vs-button>
            <vs-button @click="showToast('warning')">Warning Toast</vs-button>
            <vs-button @click="showToast('error')">Error Toast</vs-button>
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsTooltip</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-button id="tooltip-top">Top</vs-button>
            <vs-tooltip target-id="tooltip-top" placement="top">Tooltip on top</vs-tooltip>

            <vs-button id="tooltip-right">Right</vs-button>
            <vs-tooltip target-id="tooltip-right" placement="right">Tooltip on right</vs-tooltip>

            <vs-button id="tooltip-bottom">Bottom</vs-button>
            <vs-tooltip target-id="tooltip-bottom" placement="bottom">Tooltip on bottom</vs-tooltip>

            <vs-button id="tooltip-left">Left</vs-button>
            <vs-tooltip target-id="tooltip-left" placement="left">Tooltip on left</vs-tooltip>

            <vs-button id="tooltip-clickable">Clickable</vs-button>
            <vs-tooltip target-id="tooltip-clickable" clickable>Click to toggle</vs-tooltip>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useVlossom } from '@/framework';
import Divider from '../components/Divider.vue';

type ToastState = 'info' | 'success' | 'warning' | 'error';

export default defineComponent({
    name: 'Overlay',
    components: {
        Divider,
    },
    setup() {
        const $vs = useVlossom();

        const modalOpen = ref(false);
        const drawerLeft = ref(false);
        const drawerRight = ref(false);
        const drawerTop = ref(false);
        const drawerBottom = ref(false);

        function showToast(state: ToastState) {
            const messages: Record<ToastState, string> = {
                info: 'This is an info toast message',
                success: 'Operation completed successfully!',
                warning: 'Warning: Please check your input',
                error: 'Error: Something went wrong',
            };
            $vs.toast[state](messages[state]);
        }

        return {
            modalOpen,
            drawerLeft,
            drawerRight,
            drawerTop,
            drawerBottom,
            showToast,
        };
    },
});
</script>
