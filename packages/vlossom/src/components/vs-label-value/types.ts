import type { BoxStyleSet, TextStyleSet } from '@/declaration';

export interface VsLabelValueStyleSet extends Omit<BoxStyleSet, 'backgroundColor' | 'padding'> {
    label?: TextStyleSet & {
        backgroundColor?: string;
        padding?: string;
        width?: string;
    };
    value?: TextStyleSet & {
        backgroundColor?: string;
        padding?: string;
    };
}
