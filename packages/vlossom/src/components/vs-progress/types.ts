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
        bar?: {
            backgroundColor?: string;
            border?: string;
            borderRadius?: string;
        };
        value?: {
            backgroundColor?: string;
        };
        label?: {
            textShadow?: string;
            fontColor?: string;
        };
    };
    component?: CSSProperties;
}
