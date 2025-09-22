import type { BoxStyleSet, FlexStyleSet, TextStyleSet } from '@/declaration';

export interface VsLabelValueStyleSet extends Omit<BoxStyleSet, 'backgroundColor' | 'padding'> {
    label?: Omit<BoxStyleSet, 'border' | 'borderRadius' | 'opacity' | 'display'> &
        FlexStyleSet &
        TextStyleSet & { width?: string };
    value?: Omit<BoxStyleSet, 'border' | 'borderRadius' | 'opacity' | 'display'> &
        FlexStyleSet &
        TextStyleSet & { width?: string };
}
