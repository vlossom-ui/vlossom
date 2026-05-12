import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsProgress from './VsProgress.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsProgress: typeof VsProgress;
    }
}

export type { VsProgress };

export interface VsProgressRef extends ComponentPublicInstance<typeof VsProgress> {}

export interface VsProgressStyleSet extends CSSProperties {
    $barBackgroundColor?: string;
    $barBorder?: string;
    $barBorderRadius?: string;
    $valueBackgroundColor?: string;
    $labelTextShadow?: string;
    $labelFontColor?: string;
}
