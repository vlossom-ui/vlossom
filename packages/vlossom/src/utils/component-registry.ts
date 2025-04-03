import type { App } from 'vue';
// import type { VsComponent } from '@/declaration';

export const componentRegistryUtil = {
    extractComponentNameFromPath(path: string): string {
        const filename = path.split('/').pop() || '';
        return filename.replace(/\.\w+$/, '');
    },

    async registerSingleComponent(
        app: App,
        path: string,
        modules: Record<string, () => Promise<any>>,
        components: string[],
    ): Promise<void> {
        try {
            const module = await modules[path]();
            const component = module.default;

            // Skip if component list is provided and component is not in the list
            if (components.length > 0 && !components.includes(component.name)) {
                return;
            }

            // Extract component name with fallback to filename
            const componentName = component.name || this.extractComponentNameFromPath(path);
            app.component(componentName, component);
        } catch (error) {
            console.error(`Failed to register component from path: ${path}`, error);
        }
    },

    registerComponents(app: App, components: string[] = []): Promise<void[]> {
        const modules = import.meta.glob('../components/**/*.vue', { eager: false });

        // Register all components and handle any errors
        return Promise.all(
            Object.keys(modules).map((path) => this.registerSingleComponent(app, path, modules, components)),
        ).catch((error) => {
            console.error('Failed to register components:', error);
            return Promise.reject(error);
        });
    },
};
