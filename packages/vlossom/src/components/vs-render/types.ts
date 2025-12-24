import type { ComponentPublicInstance } from 'vue';
import type VsRender from './VsRender.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsRender: typeof VsRender;
    }
}

export type { VsRender };

export interface VsRenderRef extends ComponentPublicInstance<typeof VsRender> {}
