<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Overlay Components</h2>

        <h3 class="mb-4 font-semibold">VsDrawer</h3>
        <vs-block class="mb-4">
            <vs-radio-set
                v-model="drawerOptions.placement"
                label="placement"
                :options="['left', 'right', 'top', 'bottom']"
                no-messages
            />
            <vs-grid :grid-size="5" column-gap="1rem" row-gap="3rem">
                <vs-switch v-model="drawerOptions.dimmed" label="dimmed" :grid="1" no-messages />
                <vs-switch v-model="drawerOptions.dimClose" label="dimClose" :grid="1" no-messages />
                <vs-switch v-model="drawerOptions.escClose" label="escClose" :grid="1" no-messages />
                <vs-switch v-model="drawerOptions.focusLock" label="focusLock" :grid="1" no-messages />
                <vs-switch v-model="drawerOptions.fixed" label="fixed" :grid="1" no-messages />
            </vs-grid>
        </vs-block>
        <vs-container
            class="mb-4 overflow-hidden rounded-lg border border-gray-400 dark:border-gray-500"
            :style="{ height: '30rem' }"
        >
            <div class="flex h-full items-center justify-center">
                <vs-button @click="drawerOpen = true">Open Drawer</vs-button>
            </div>
            <vs-drawer
                v-model="drawerOpen"
                :placement="drawerOptions.placement"
                :dimmed="drawerOptions.dimmed"
                :dim-close="drawerOptions.dimClose"
                :esc-close="drawerOptions.escClose"
                :focus-lock="drawerOptions.focusLock"
                :fixed="drawerOptions.fixed"
                :style-set="drawerStyleSet"
            >
                <template #header>
                    <div class="p-2 text-sm font-bold capitalize">{{ drawerOptions.placement }} Drawer</div>
                </template>
                <div class="p-2 text-sm">
                    Drawer content here
                    <vs-button>button</vs-button>
                </div>
                <template #footer>
                    <div class="p-2">
                        <vs-button dense @click="drawerOpen = false">Close</vs-button>
                    </div>
                </template>
            </vs-drawer>
        </vs-container>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsModal</h3>
        <vs-block class="mb-4">
            <vs-grid :grid-size="4" column-gap="1rem">
                <vs-switch v-model="modalOptions.dimmed" label="dimmed" :grid="1" no-messages />
                <vs-switch v-model="modalOptions.dimClose" label="dimClose" :grid="1" no-messages />
                <vs-switch v-model="modalOptions.escClose" label="escClose" :grid="1" no-messages />
                <vs-switch v-model="modalOptions.focusLock" label="focusLock" :grid="1" no-messages />
            </vs-grid>
        </vs-block>
        <vs-button @click="modalOpen = true">Open Modal</vs-button>
        <vs-modal
            v-model="modalOpen"
            :size="{ width: '500px', height: 'auto' }"
            :dimmed="modalOptions.dimmed"
            :dim-close="modalOptions.dimClose"
            :esc-close="modalOptions.escClose"
            :focus-lock="modalOptions.focusLock"
        >
            <div class="p-8">
                <h3 class="mb-4">Modal Title</h3>
                <p class="mb-4">This is modal content. You can put anything here.</p>
                <vs-button @click="modalOpen = false">Close</vs-button>
            </div>
        </vs-modal>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">Toast Plugin</h3>
        <vs-block class="mb-4">
            <vs-grid :grid-size="2" column-gap="1rem" row-gap="1rem">
                <vs-radio-set
                    v-model="toastOptions.placement"
                    label="placement"
                    :options="['top', 'bottom']"
                    :grid="1"
                    no-messages
                />
                <vs-radio-set
                    v-model="toastOptions.align"
                    label="align"
                    :options="['start', 'center', 'end']"
                    :grid="1"
                    no-messages
                />
            </vs-grid>
            <vs-input
                v-model="toastOptions.timeout"
                label="timeout (ms)"
                type="number"
                width="200px"
                no-messages
                class="my-2"
            />
            <vs-grid :grid-size="2" column-gap="1rem">
                <vs-switch v-model="toastOptions.autoClose" label="autoClose" :grid="1" no-messages />
                <vs-switch v-model="toastOptions.primary" label="primary" :grid="1" no-messages />
            </vs-grid>
        </vs-block>
        <div class="flex flex-wrap items-start gap-4">
            <vs-button @click="showToast('info')">Info Toast</vs-button>
            <vs-button @click="showToast('success')">Success Toast</vs-button>
            <vs-button @click="showToast('warning')">Warning Toast</vs-button>
            <vs-button @click="showToast('error')">Error Toast</vs-button>
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsTooltip</h3>
        <vs-block class="mb-4">
            <vs-grid :grid-size="2" column-gap="1rem" row-gap="1rem">
                <vs-radio-set
                    v-model="tooltipOptions.placement"
                    label="placement"
                    :options="['top', 'right', 'bottom', 'left']"
                    :grid="1"
                    no-messages
                />
                <vs-radio-set
                    v-model="tooltipOptions.align"
                    label="align"
                    :options="['start', 'center', 'end']"
                    :grid="1"
                    no-messages
                />
            </vs-grid>
            <vs-grid :grid-size="2" column-gap="1rem" class="my-2">
                <vs-input
                    v-model="tooltipOptions.enterDelay"
                    label="enterDelay (ms)"
                    type="number"
                    :grid="1"
                    no-messages
                />
                <vs-input
                    v-model="tooltipOptions.leaveDelay"
                    label="leaveDelay (ms)"
                    type="number"
                    :grid="1"
                    no-messages
                />
            </vs-grid>
            <vs-grid :grid-size="4" column-gap="1rem">
                <vs-switch v-model="tooltipOptions.clickable" label="clickable" :grid="1" no-messages />
                <vs-switch v-model="tooltipOptions.contentsHover" label="contentsHover" :grid="1" no-messages />
                <vs-switch v-model="tooltipOptions.noAnimation" label="noAnimation" :grid="1" no-messages />
                <vs-switch v-model="tooltipOptions.disabled" label="disabled" :grid="1" no-messages />
            </vs-grid>
        </vs-block>
        <div class="flex flex-wrap items-start gap-4">
            <vs-tooltip
                :placement="tooltipOptions.placement"
                :align="tooltipOptions.align"
                :clickable="tooltipOptions.clickable"
                :contents-hover="tooltipOptions.contentsHover"
                :enter-delay="tooltipOptions.enterDelay"
                :leave-delay="tooltipOptions.leaveDelay"
                :no-animation="tooltipOptions.noAnimation"
                :disabled="tooltipOptions.disabled"
            >
                <vs-button>Hover me</vs-button>
                <template #tooltip>Tooltip content here</template>
            </vs-tooltip>
        </div>
    </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useVlossom } from '@/framework';
import type { DrawerPlacement, Placement, Alignment } from '@/declaration';
import type { VsDrawerStyleSet } from '@/components/vs-drawer/types';

type ToastState = 'info' | 'success' | 'warning' | 'error';

export default defineComponent({
    name: 'Overlay',
    setup() {
        const $vs = useVlossom();

        // Drawer
        const drawerOpen = ref(false);
        const drawerOptions = reactive({
            placement: 'left' as DrawerPlacement,
            dimmed: true,
            dimClose: true,
            escClose: true,
            focusLock: false,
            fixed: false,
        });
        const drawerStyleSet = computed((): VsDrawerStyleSet => {
            if (drawerOptions.fixed && drawerOptions.placement !== 'bottom') {
                return {
                    content: {
                        padding: '3rem 0 0 0',
                    },
                };
            }
            return {};
        });

        // Modal
        const modalOpen = ref(false);
        const modalOptions = reactive({
            dimmed: true,
            dimClose: true,
            escClose: true,
            focusLock: false,
        });

        // Toast
        const toastOptions = reactive({
            placement: 'top' as Exclude<Placement, 'left' | 'right' | 'middle'>,
            align: 'center' as Alignment,
            autoClose: true,
            timeout: 3000,
            primary: false,
        });

        function showToast(state: ToastState) {
            const messages: Record<ToastState, string> = {
                info: 'This is an info toast message',
                success: 'Operation completed successfully!',
                warning: 'Warning: Please check your input',
                error: 'Error: Something went wrong',
            };
            $vs.toast[state](messages[state], {
                placement: toastOptions.placement,
                align: toastOptions.align,
                autoClose: toastOptions.autoClose,
                timeout: toastOptions.timeout,
                primary: toastOptions.primary,
            });
        }

        // Tooltip
        const tooltipOptions = reactive({
            placement: 'top' as Exclude<Placement, 'middle'>,
            align: 'center' as Alignment,
            clickable: false,
            contentsHover: false,
            enterDelay: 0,
            leaveDelay: 0,
            noAnimation: false,
            disabled: false,
        });

        return {
            drawerOpen,
            drawerOptions,
            drawerStyleSet,
            modalOpen,
            modalOptions,
            toastOptions,
            showToast,
            tooltipOptions,
        };
    },
});
</script>
