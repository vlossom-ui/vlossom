import type { BoxStyleSet, FlexStyleSet, TextStyleSet } from '@/declaration';

export interface VsLabelValueStyleSet extends Omit<BoxStyleSet, 'backgroundColor' | 'padding'> {
    label?: BoxStyleSet & FlexStyleSet & TextStyleSet & { width?: string };
    value?: BoxStyleSet & FlexStyleSet & TextStyleSet & { width?: string };
}
