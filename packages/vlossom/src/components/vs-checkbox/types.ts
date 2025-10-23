import type VsCheckbox from './VsCheckbox.vue';
import type { SizeStyleSet, BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsCheckbox: typeof VsCheckbox;
    }
}

export type { VsCheckbox };

export interface VsCheckboxStyleSet extends SizeStyleSet, BoxStyleSet {
    borderWidth?: string;
    checkboxColor?: string;
    checkboxSize?: string;
    label?: TextStyleSet;
    checkedLabel?: TextStyleSet;
    indeterminateLabel?: TextStyleSet;
}
