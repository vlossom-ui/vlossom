import type { App, Component } from 'vue';
import { Vlossom } from './vlossom-class';
import { type VsComponent, type VlossomOptions } from '@/declaration';
import { componentsMap } from '@/components/components-map';

let vlossom: Vlossom;

// Synchronous component registration with async loading for better tree shaking
function registerComponents(
    app: App,
    asyncComponentsMap: { [key in VsComponent]: Component } & { [key: string]: Component },
    components: (VsComponent | string)[] = [],
) {
    // If no specific components are requested, register all available components
    const componentsToRegister: string[] = components.length === 0 ? Object.keys(asyncComponentsMap) : components;

    componentsToRegister.forEach((componentName) => {
        try {
            const component = asyncComponentsMap[componentName];
            app.component(componentName, component);
            console.log(`[Vlossom] Component ${componentName} registered`);
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
            registerComponents(app, componentsMap, options?.components || []);
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
