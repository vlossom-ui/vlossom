import type { ComponentPublicInstance } from 'vue';
import type VsInnerScroll from './VsInnerScroll.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsInnerScroll: typeof VsInnerScroll;
    }
}

export type { VsInnerScroll };

export interface VsInnerScrollRef extends ComponentPublicInstance<typeof VsInnerScroll> {
    hasScroll: () => boolean;
}
