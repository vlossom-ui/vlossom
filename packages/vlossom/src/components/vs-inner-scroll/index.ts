import type VsInnerScroll from './VsInnerScroll.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsInnerScroll: typeof VsInnerScroll;
    }
}

export * from './types';
export type { VsInnerScroll };
