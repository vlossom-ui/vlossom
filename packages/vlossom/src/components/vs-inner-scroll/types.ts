import type { ComponentPublicInstance, CSSProperties } from 'vue';
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

export interface VsInnerScrollStyleSet {
    component?: CSSProperties;
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
