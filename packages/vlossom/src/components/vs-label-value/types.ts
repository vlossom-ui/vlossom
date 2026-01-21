import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsLabelValue from './VsLabelValue.vue';
import type { TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsLabelValue: typeof VsLabelValue;
    }
}

export type { VsLabelValue };

export interface VsLabelValueRef extends ComponentPublicInstance<typeof VsLabelValue> {}

interface ValueVariables {
    backgroundColor?: string;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    padding?: string;
    verticalAlign?: string;
}

interface LabelVariables extends TextStyleSet {
    width?: string;
}

export interface VsLabelValueStyleSet {
    variables?: {
        border?: string;
        borderRadius?: string;
        label?: LabelVariables;
        value?: ValueVariables;
    };
    component?: CSSProperties;
}
