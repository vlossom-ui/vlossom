import type { App } from 'vue';
import { Vlossom } from './vlossom-class';
import { type VsComponent, type VlossomOptions } from '@/declaration';
import { createComponentsMap } from '@/components';

let vlossom: Vlossom;

// Synchronous component registration with async loading for better tree shaking
function registerComponents(app: App, components: (VsComponent | string)[] = []) {
    // 실제 필요한 컴포넌트만 동적으로 생성
    const allComponentsMap = createComponentsMap();

    // If no specific components are requested, register all available components
    const componentsToRegister: string[] = components.length === 0 ? Object.keys(allComponentsMap) : components;

    componentsToRegister.forEach((componentName) => {
        try {
            const component = allComponentsMap[componentName as VsComponent];
            if (component) {
                app.component(componentName, component);
            }
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
            registerComponents(app, options?.components || []);
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
