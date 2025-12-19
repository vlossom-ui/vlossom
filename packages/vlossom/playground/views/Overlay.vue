<template>
    <section class="section">
        <h2 class="section-title">Overlay Components</h2>

        <!-- Drawer -->
        <h3 class="component-title">VsDrawer</h3>
        <div class="component-row">
            <vs-button @click="drawerLeft = true">Left Drawer</vs-button>
            <vs-button @click="drawerRight = true">Right Drawer</vs-button>
            <vs-button @click="drawerTop = true">Top Drawer</vs-button>
            <vs-button @click="drawerBottom = true">Bottom Drawer</vs-button>
        </div>
        <vs-drawer v-model="drawerLeft" placement="left" dimmed dim-close>
            <template #header>
                <div style="padding: 1rem; font-weight: bold">Left Drawer</div>
            </template>
            <div style="padding: 1rem">Drawer content here</div>
        </vs-drawer>
        <vs-drawer v-model="drawerRight" placement="right" dimmed dim-close>
            <template #header>
                <div style="padding: 1rem; font-weight: bold">Right Drawer</div>
            </template>
            <div style="padding: 1rem">Drawer content here</div>
        </vs-drawer>
        <vs-drawer v-model="drawerTop" placement="top" dimmed dim-close size="200px">
            <div style="padding: 1rem">Top Drawer content</div>
        </vs-drawer>
        <vs-drawer v-model="drawerBottom" placement="bottom" dimmed dim-close size="200px">
            <div style="padding: 1rem">Bottom Drawer content</div>
        </vs-drawer>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Modal -->
        <h3 class="component-title">VsModal</h3>
        <vs-button @click="modalOpen = true">Open Modal</vs-button>
        <vs-modal v-model="modalOpen" :size="{ width: '500px', height: 'auto' }">
            <div style="padding: 2rem">
                <h3 style="margin-bottom: 1rem">Modal Title</h3>
                <p style="margin-bottom: 1rem">This is modal content. You can put anything here.</p>
                <vs-button @click="modalOpen = false">Close</vs-button>
            </div>
        </vs-modal>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Toast (via plugin) -->
        <h3 class="component-title">Toast Plugin</h3>
        <div class="component-row">
            <vs-button @click="showToast('info')">Info Toast</vs-button>
            <vs-button @click="showToast('success')">Success Toast</vs-button>
            <vs-button @click="showToast('warning')">Warning Toast</vs-button>
            <vs-button @click="showToast('error')">Error Toast</vs-button>
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Tooltip -->
        <h3 class="component-title">VsTooltip</h3>
        <div class="component-row">
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

type ToastState = 'info' | 'success' | 'warning' | 'error';

export default defineComponent({
    name: 'Overlay',
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

<style scoped>
.section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--vs-line-color);
}

.component-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--vs-font-color);
}

.component-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}
</style>
