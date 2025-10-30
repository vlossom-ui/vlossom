import type VsLabelValue from './VsLabelValue.vue';
import type { BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsLabelValue: typeof VsLabelValue;
    }
}

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
