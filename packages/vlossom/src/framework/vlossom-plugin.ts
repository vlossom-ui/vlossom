import type { App } from 'vue';
import { Vlossom } from './vlossom-class';
import { VsComponent, type VlossomOptions } from '@/declaration';
import { createAsyncComponent } from '@/components';

let vlossom: Vlossom;

function registerComponents(app: App, components: VsComponent[] = []) {
    components.forEach((componentName) => {
        try {
            const component = createAsyncComponent(componentName);
            app.component(componentName, component);
        } catch (error) {
            console.warn(`[Vlossom] Failed to register component ${componentName}:`, error);
        }
    });
}

export function createVlossom(options?: VlossomOptions) {
    vlossom = new Vlossom(options);

    return {
        install: (app: App) => {
            app.config.globalProperties.$vs = vlossom;
            const componentsToRegister = options?.components || Object.values(VsComponent);
            registerComponents(app, componentsToRegister);
        },
    };
}

export function useVlossom() {
    if (!vlossom) {
        throw new Error('[Vlossom] Vlossom is not initialized. Please use createVlossom() to initialize it.');
    }

    return vlossom;
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $vs: Vlossom;
    }
}
