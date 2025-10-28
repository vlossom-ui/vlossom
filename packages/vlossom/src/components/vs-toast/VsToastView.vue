<template>
    <div class="vs-toast-view" :class="{ 'vs-toast-fixed': isFixed }" :id="wrapperId">
        <div
            v-for="[key, toasts] in Object.entries(toastsByPosition)"
            :key="key"
            :class="['vs-toast-container', `vs-toast-${key.split('-')[0]}`, `vs-toast-${key.split('-')[1]}`]"
        >
            <TransitionGroup name="toasts" appear>
                <vs-toast v-for="toast in toasts" :key="toast.id" />
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

const name = VsComponent.VsToastView;
export default defineComponent({
    name,
    components: { VsToast },
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

        const wrapperId = computed(() => {
            const containerValue = container.value || 'body';
            return `vs-toast-${containerValue.replace('#', '').replace('.', '')}`;
        });

        const isFixed = computed(() => {
            const containerValue = container.value || 'body';
            return containerValue === 'body';
        });

        const hasToast = computed(() => Object.keys(toastsByPosition.value).length > 0);

        return { toastsByPosition, wrapperId, isFixed, hasToast };
    },
});
</script>

<style src="./VsToastView.css" />
