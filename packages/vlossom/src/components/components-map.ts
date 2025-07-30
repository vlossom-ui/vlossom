import { defineAsyncComponent, type Component } from 'vue';
import { VsComponent } from '@/declaration';

export function createComponentsMap(): { [key in VsComponent]: Component } {
    return {
        [VsComponent.VsButton]: defineAsyncComponent(() => import('./vs-button/VsButton.vue')),
        [VsComponent.VsSection]: defineAsyncComponent(() => import('./vs-section/VsSection.vue')),
    };
}
