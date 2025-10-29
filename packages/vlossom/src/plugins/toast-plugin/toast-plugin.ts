import { type Component } from 'vue';
import { useOverlayContainerStore, useToastContainerStore } from '@/stores';
import { logUtil } from '@/utils';
import type { ToastOptions, ToastPlugin } from './types';
import { createToastInfo } from './toast-model';

export function createToastPlugin(): ToastPlugin {
    return {
        show(content: string | Component, options: ToastOptions = {}) {
            const container = options.container || 'body';

            const overlayContainerStore = useOverlayContainerStore();
            const toastStore = useToastContainerStore();

            // mount ToastView to OverlayWrapper
            const overlayId = `vs-toast-overlay-${container.replace('#', '')}`;
            overlayContainerStore.push(overlayId, container, 'VsToastView');

            const containerElement: HTMLElement | null = document.querySelector(container);

            if (!containerElement) {
                logUtil.error('toast-plugin.show', `Toast container not found: ${container}`);
                return;
            }

            if (!containerElement.style.position) {
                containerElement.style.position = 'relative';
            }

            const toastInfo = createToastInfo(content, options);
            toastStore.push(container, toastInfo);

            if (options.logger) {
                options.logger(content);
            }
        },

        info(content: string | Component, options: ToastOptions = {}) {
            this.show(content, { colorScheme: 'cyan', ...options });
        },

        success(content: string | Component, options: ToastOptions = {}) {
            this.show(content, { colorScheme: 'green', ...options });
        },

        warning(content: string | Component, options: ToastOptions = {}) {
            this.show(content, { colorScheme: 'yellow', ...options });

            console.warn(content);
        },

        error(content: string | Component, options: ToastOptions = {}) {
            this.show(content, { colorScheme: 'red', ...options });

            console.error(content);
        },

        remove(container, id: string) {
            const toastStore = useToastContainerStore();
            toastStore.remove(container, id);
        },

        clear(container = 'body') {
            const toastStore = useToastContainerStore();
            toastStore.delete(container);
        },
    };
}
