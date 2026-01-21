import type { ComponentPublicInstance } from 'vue';
import type VsLabelValue from './VsLabelValue.vue';

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

interface LabelVariables extends ValueVariables {
    width?: string;
}

export interface VsLabelValueStyleSet {
    variables?: {
        border?: string;
        borderRadius?: string;
        label?: LabelVariables;
        value?: ValueVariables;
    };
}
