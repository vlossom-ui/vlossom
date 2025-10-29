<template>
    <div class="vs-toast-view" :class="{ 'vs-toast-fixed': isFixed }">
        <div
            v-for="[key, toasts] in Object.entries(toastsByPosition)"
            :key="key"
            :class="['vs-toast-container', `vs-toast-${key.split('-')[0]}`, `vs-toast-${key.split('-')[1]}`]"
        >
            <TransitionGroup name="toasts" appear>
                <vs-toast
                    v-for="{
                        id,
                        colorScheme,
                        styleSet,
                        align,
                        placement,
                        autoClose,
                        primary,
                        timeout,
                        logger,
                        content,
                    } in toasts"
                    class="vs-toast-item"
                    :key="id"
                    :color-scheme
                    :style-set
                    :align
                    :placement
                    :auto-close
                    :primary
                    :timeout
                    :logger
                    @close="removeToast(id)"
                >
                    <vs-render :content="renderContent(content)" />
                </vs-toast>
            </TransitionGroup>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, shallowRef, toRefs, type Component } from 'vue';
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

        function renderContent(content: string | Component) {
            if (typeof content === 'string') {
                return content;
            }
            return shallowRef(content);
        }

        return { toastsByPosition, isFixed, removeToast, renderContent };
    },
});
</script>

<style src="./VsToastView.css" />
