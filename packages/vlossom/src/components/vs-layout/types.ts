import type { ComponentPublicInstance } from 'vue';
import type VsLayout from './VsLayout.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsLayout: typeof VsLayout;
    }
}

export type { VsLayout };

export interface VsLayoutRef extends ComponentPublicInstance<typeof VsLayout> {}
