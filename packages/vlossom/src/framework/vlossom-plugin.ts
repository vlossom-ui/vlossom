import type { App } from 'vue';
import { Vlossom } from './vlossom-class';
import type { VlossomOptions } from '@/declaration';

declare module 'vue' {
    interface ComponentCustomProperties {
        $vs: Vlossom;
    }
}

let vlossom: Vlossom;

export function createVlossom(options: VlossomOptions) {
    vlossom = new Vlossom(options);

    return {
        install: (app: App) => {
            app.config.globalProperties.$vs = vlossom;

            // 전달받은 컴포넌트들을 등록
            Object.entries(options.components).forEach(([name, component]) => {
                if (component && typeof component === 'object') {
                    app.component(name, component);
                } else {
                    console.warn('[Vlossom] Invalid component:', component);
                }
            });
        },
    };
}

export function useVlossom() {
    if (!vlossom) {
        throw new Error('[Vlossom] Vlossom is not initialized. Please use createVlossom() to initialize it.');
    }

    return vlossom;
}
