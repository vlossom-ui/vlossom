import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, TextStyleSet } from '@/declaration';
import type VsLabelValue from './VsLabelValue.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsLabelValue: typeof VsLabelValue;
    }
}

export type { VsLabelValue };

export interface VsLabelValueRef extends ComponentPublicInstance<typeof VsLabelValue> {}

export interface VsLabelValueStyleSet extends Omit<BoxStyleSet, 'backgroundColor' | 'padding'> {
    label?: TextStyleSet & {
        backgroundColor?: string;
        padding?: string;
        verticalAlign?: string;
        width?: string;
    };

    value?: TextStyleSet & {
        backgroundColor?: string;
        padding?: string;
        verticalAlign?: string;
    };
}
