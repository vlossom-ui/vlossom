import type VsVisibleRender from './VsVisibleRender.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsVisibleRender: typeof VsVisibleRender;
    }
}

export type { VsVisibleRender };

export interface VsVisibleRenderRef {
    scrollToElement: (element: HTMLElement) => void;
}
