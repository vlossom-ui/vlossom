import type { BoxStyleSet, FlexStyleSet, TextStyleSet } from '@/declaration';

export interface VsLabelValueStyleSet extends Omit<BoxStyleSet, 'backgroundColor'> {
    label?: BoxStyleSet & FlexStyleSet & TextStyleSet & { width?: string };
    value?: BoxStyleSet & FlexStyleSet & TextStyleSet & { width?: string };
}
