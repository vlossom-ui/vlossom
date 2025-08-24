import type VsInnerScroll from './VsInnerScroll.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsInnerScroll: typeof VsInnerScroll;
    }
}

export interface VsInnerScrollStyleSet {
    header?: {
        padding?: string;
    };
    padding?: string;
    footer?: {
        padding?: string;
    };
}
