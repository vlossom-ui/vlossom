import type VsInfiniteScroll from './VsInfiniteScroll.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsInfiniteScroll: typeof VsInfiniteScroll;
    }
}

export type { VsInfiniteScroll };
