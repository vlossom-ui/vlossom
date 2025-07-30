import { defineAsyncComponent } from 'vue';
import type VsSection from './VsSection.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSection: typeof VsSection;
    }
}

export const VsSectionAsync = defineAsyncComponent(() => import('./VsSection.vue'));

export * from './types';
