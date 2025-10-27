import type { App, Component } from 'vue';
import { createApp, h } from 'vue';
import { useToastStore } from '@/components/vs-toast/composables/toast-store-composable';
import VsToastView from '@/components/vs-toast/VsToastView.vue';
import type { ToastInfo, ToastOptions } from '@/components/vs-toast/types';

let toastApp: App | null = null;
let toastContainer: HTMLElement | null = null;

export function mountToastApp(parentApp: App) {
    if (toastApp) {
        return; // 이미 마운트되어 있음
    }

    // Toast container를 body에 추가
    toastContainer = document.createElement('div');
    toastContainer.id = 'vs-toast-container';
    document.body.appendChild(toastContainer);

    // Toast App 생성
    toastApp = createApp({
        name: 'VsToastApp',
        setup() {
            return () => h(VsToastView, { container: 'body' });
        },
    });

    // Parent app의 config를 복사 (전역 설정 상속)
    toastApp.config.globalProperties = parentApp.config.globalProperties;
    toastApp.config.optionMergeStrategies = parentApp.config.optionMergeStrategies;
    toastApp.config.errorHandler = parentApp.config.errorHandler;
    toastApp.config.warnHandler = parentApp.config.warnHandler;

    // Parent app의 provides를 복사 (provide/inject 지원)
    if (parentApp._context?.provides) {
        Object.keys(parentApp._context.provides).forEach((key) => {
            // @ts-expect-error - Internal Vue API access for context inheritance
            toastApp._context.provides[key] = parentApp._context.provides[key];
        });
    }

    // 마운트
    toastApp.mount(toastContainer);
}

export function unmountToastApp() {
    if (toastApp && toastContainer) {
        toastApp.unmount();
        toastContainer.remove();
        toastContainer = null;
        toastApp = null;
    }
}

export interface ToastPlugin {
    show(message: string | Component, options?: ToastOptions): string;
    remove(id: string, container?: string): void;
    clear(container?: string): void;
}

export function createToastPlugin(): ToastPlugin {
    return {
        show(message, options = {}) {
            const toastStore = useToastStore();
            const container = options.container || 'body';

            const id = `toast-${Date.now()}-${Math.random()}`;

            const toastInfo: ToastInfo = {
                id,
                content: message,
                container,
                colorScheme: options.colorScheme,
                styleSet: options.styleSet,
                align: options.align,
                autoClose: options.autoClose !== false,
                placement: options.placement,
                primary: options.primary,
                timeout: options.timeout || 5000,
                logger: options.logger,
            };

            toastStore.add(toastInfo);

            // Auto close
            if (toastInfo.autoClose && toastInfo.timeout) {
                setTimeout(() => {
                    toastStore.remove(container, id);
                }, toastInfo.timeout);
            }

            return id;
        },

        remove(id, container = 'body') {
            const toastStore = useToastStore();
            toastStore.remove(container, id);
        },

        clear(container = 'body') {
            const toastStore = useToastStore();
            toastStore.delete(container);
        },
    };
}
