import type VsLoading from './VsLoading.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsLoading: typeof VsLoading;
    }
}

export * from './types';
export type { VsLoading };
