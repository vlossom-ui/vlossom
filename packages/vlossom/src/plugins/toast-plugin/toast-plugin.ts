import { type Component } from 'vue';
import { useToastContainerStore } from '@/stores';
import { stringUtil } from '@/utils';
import { useOverlayDom } from '@/composables';
import type { ToastInfo, ToastOptions, ToastPlugin } from './types';

export function createToastPlugin(): ToastPlugin {
    return {
        show(content: string | Component, options: ToastOptions = {}) {
            const toastStore = useToastContainerStore();
            const container = options.container || 'body';
            const containerElement: Element | null = document.querySelector(container);
            const { appendOverlayDom } = useOverlayDom();

            if (!containerElement) {
                return;
            }

            const toastViewId = `#vs-toast-view-${container.replace('#', '')}`;

            appendOverlayDom(containerElement, toastViewId);

            const id = `vs-toast-${stringUtil.createID()}`;

            const toastInfo: ToastInfo = {
                ...options,
                container,
                id,
                content,
            };

            toastStore.push(container, toastInfo);

            // Auto close
            if (toastInfo.autoClose && toastInfo.timeout) {
                setTimeout(() => {
                    toastStore.remove(container, id);
                }, toastInfo.timeout);
            }
        },

        remove(id, container = 'body') {
            const toastStore = useToastContainerStore();
            toastStore.remove(container, id);
        },

        clear(container = 'body') {
            const toastStore = useToastContainerStore();
            toastStore.delete(container);
        },
    };
}
