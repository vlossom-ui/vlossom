import type VsLoading from './VsLoading.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsLoading: typeof VsLoading;
    }
}

export interface VsLoadingStyleSet {
    color?: string;
    width?: string;
    height?: string;
    barWidth?: string;
}
