import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsProgress from './VsProgress.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsProgress: typeof VsProgress;
    }
}

export type { VsProgress };

export interface VsProgressRef extends ComponentPublicInstance<typeof VsProgress> {}

export interface VsProgressStyleSet {
    variables?: {
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        fontColor?: string;
        textShadow?: string;
        valueColor?: string;
    };
    component?: CSSProperties;
}
