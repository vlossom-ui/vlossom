import { defineAsyncComponent } from 'vue';
import type VsButton from './VsButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsButton: typeof VsButton;
    }
}

export const VsButtonAsync = defineAsyncComponent(() => import('./VsButton.vue'));

export * from './types';
