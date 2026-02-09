import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsLabelValue from './VsLabelValue.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsLabelValue: typeof VsLabelValue;
    }
}

export type { VsLabelValue };

export interface VsLabelValueRef extends ComponentPublicInstance<typeof VsLabelValue> {}

export interface VsLabelValueStyleSet {
    variables?: {
        width?: string;
        border?: string;
    };
    label?: CSSProperties;
    value?: CSSProperties;
    component?: CSSProperties;
}
