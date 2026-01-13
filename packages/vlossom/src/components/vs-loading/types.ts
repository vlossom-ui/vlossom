import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsLoading from './VsLoading.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsLoading: typeof VsLoading;
    }
}

export type { VsLoading };

export interface VsLoadingRef extends ComponentPublicInstance<typeof VsLoading> {}

export interface VsLoadingStyleSet {
    variables?: {
        barWidth?: string;
        color?: string;
    };
    component?: CSSProperties;
}
