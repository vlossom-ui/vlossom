import type { BoxStyleSet, FlexStyleSet } from '@/declaration';

export interface VsLabelValueStyleSet {
    border?: string;
    borderRadius?: string;
    label?: BoxStyleSet & FlexStyleSet & { width?: string };
    value?: BoxStyleSet & FlexStyleSet & { width?: string };
    actions?: BoxStyleSet & FlexStyleSet & { width?: string };
}
