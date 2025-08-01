import { defineAsyncComponent, type Component } from 'vue';
import { VsComponent } from '@/declaration';

export function createAsyncComponent(componentName: VsComponent): Component {
    switch (componentName) {
        case VsComponent.VsButton:
            return defineAsyncComponent(() => import('./vs-button/VsButton.vue'));
        case VsComponent.VsSection:
            return defineAsyncComponent(() => import('./vs-section/VsSection.vue'));
        default:
            throw new Error(`[Vlossom] Unknown component: ${componentName}`);
    }
}
