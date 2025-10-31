<template>
    <div class="vs-toast-view" :class="{ 'vs-toast-fixed': isFixed }">
        <div
            v-for="[key, toasts] in Object.entries(toastsByPosition)"
            :key="key"
            :class="['vs-toast-container', ...getPositionClass(key)]"
        >
            <TransitionGroup name="toasts" appear>
                <vs-toast
                    v-for="toast in toasts"
                    class="vs-toast-item"
                    :key="toast.id"
                    :color-scheme="toast.colorScheme"
                    :style-set="toast.styleSet"
                    :primary="toast.primary"
                    :auto-close="toast.autoClose"
                    :timeout="toast.timeout"
                    @close="removeToast(toast.id)"
                >
                    <vs-render :content="toast.content" />
                </vs-toast>
            </TransitionGroup>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { useToastContainerStore } from '@/stores';
import type { ToastInfo } from '@/plugins';

import VsToast from './VsToast.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

const name = VsComponent.VsToastView;
export default defineComponent({
    name,
    components: { VsToast, VsRender },
    props: {
        container: { type: String, default: 'body' },
    },
    setup(props) {
        const { container } = toRefs(props);

        const toastStore = useToastContainerStore();

        const toastsByPosition = computed(() => {
            const containerValue = container.value || 'body';
            const toasts = toastStore.get(containerValue);
            return toasts.reduce(
                (acc, toast) => {
                    const key = `${toast.placement}-${toast.align}`;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(toast);
                    return acc;
                },
                {} as Record<string, ToastInfo[]>,
            );
        });

        const isFixed = computed(() => {
            const containerValue = container.value || 'body';
            return containerValue === 'body';
        });

        function removeToast(id: string) {
            toastStore.remove(container.value, id);
        }

        function getPositionClass(key: string) {
            const [placement, align] = key.split('-');
            return [`vs-toast-${placement}`, `vs-toast-${align}`];
        }

        return { toastsByPosition, isFixed, removeToast, getPositionClass };
    },
});
</script>

<style src="./VsToastView.css" />
