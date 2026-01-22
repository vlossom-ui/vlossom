import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsToast from './VsToast.vue';
import type VsToastView from './VsToastView.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsToast: typeof VsToast;
        VsToastView: typeof VsToastView;
    }
}

export type { VsToast, VsToastView };

export interface VsToastRef extends ComponentPublicInstance<typeof VsToast> {}

export interface VsToastViewRef extends ComponentPublicInstance<typeof VsToastView> {}

export interface VsToastStyleSet {
    variables?: {
        backgroundColor?: string;
        border?: string;
        fontColor?: string;
    };
    component?: CSSProperties;
}
