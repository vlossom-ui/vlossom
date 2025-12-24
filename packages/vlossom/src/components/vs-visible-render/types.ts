import type { ComponentPublicInstance } from 'vue';
import type VsVisibleRender from './VsVisibleRender.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsVisibleRender: typeof VsVisibleRender;
    }
}

export type { VsVisibleRender };

export interface VsVisibleRenderRef extends ComponentPublicInstance<typeof VsVisibleRender> {
    scrollToElement: (element: HTMLElement) => void;
}
