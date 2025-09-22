import type { BoxStyleSet, FlexStyleSet } from '@/declaration';

export interface VsLabelValueStyleSet extends BoxStyleSet {
    label?: BoxStyleSet & FlexStyleSet & { width?: string };
    value?: BoxStyleSet & FlexStyleSet & { width?: string };
}
