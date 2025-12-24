import type { ComponentPublicInstance } from 'vue';
import type VsResponsive from './VsResponsive.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsResponsive: typeof VsResponsive;
    }
}

export type { VsResponsive };

export interface VsResponsiveRef extends ComponentPublicInstance<typeof VsResponsive> {}
