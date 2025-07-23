import type { App } from 'vue';
import type { GlobalColorScheme, VlossomOptions, VsComponent } from './declaration';
import { useOptionsStore } from './stores';

export class Vlossom {
    constructor(options?: VlossomOptions) {
        const {
            colorScheme = {},
            // styleSet = {},
            // theme = 'light',
            // radiusRatio = 1,
        } = options || {};

        this.setColorScheme(colorScheme);
    }

    private setColorScheme(colorScheme: GlobalColorScheme) {
        const optionsStore = useOptionsStore();
        optionsStore.setColorScheme(colorScheme);
    }
}

let vlossom: Vlossom;

// Component registration function with tree shaking support
function registerComponents(app: App, components: VsComponent[] = []) {
    // Explicit component imports for better tree shaking
    const componentMap: Partial<Record<VsComponent, () => Promise<any>>> = {
        // [VsComponent.VsButton]: () => import('./components/VsButton.vue'),
        // [VsComponent.VsInput]: () => import('./components/VsInput.vue'),
        // Add components here as they are created - this ensures only requested components are bundled
    };

    // If no specific components are requested, register all available components
    const componentsToRegister = components.length === 0 ? (Object.keys(componentMap) as VsComponent[]) : components;

    componentsToRegister.forEach(async (componentName) => {
        if (componentMap[componentName]) {
            try {
                const component = await componentMap[componentName]!();
                app.component(componentName, component);
            } catch (err) {
                console.warn(`[Vlossom] Failed to load component ${componentName}:`, err);
            }
        } else {
            console.warn(`[Vlossom] Component ${componentName} not found in Component Map.`);
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
