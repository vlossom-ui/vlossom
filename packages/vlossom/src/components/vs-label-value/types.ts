import type { BoxStyleSet, FlexStyleSet } from '@/declaration';

export interface VsLabelValueStyleSet extends Omit<BoxStyleSet, 'backgroundColor'> {
    label?: BoxStyleSet & FlexStyleSet & { width?: string };
    value?: BoxStyleSet & FlexStyleSet & { width?: string };
}
