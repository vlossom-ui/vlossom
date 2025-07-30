import { VsComponent } from '@/declaration';
import { defineAsyncComponent } from 'vue';
import type { Component } from 'vue';

export function createComponentsMap(): { [key in VsComponent]: Component } {
    return {
        [VsComponent.VsButton]: defineAsyncComponent(() => import('./vs-button/VsButton.vue')),
        [VsComponent.VsSection]: defineAsyncComponent(() => import('./vs-section/VsSection.vue')),
    };
}
