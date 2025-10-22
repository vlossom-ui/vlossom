import type VsCheckbox from './VsCheckbox.vue';
import type VsCheckboxSet from './VsCheckboxSet.vue';
import type { SizeStyleSet, BoxStyleSet, TextStyleSet, FlexStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsCheckbox: typeof VsCheckbox;
        VsCheckboxSet: typeof VsCheckboxSet;
    }
}

export type { VsCheckbox, VsCheckboxSet };

export interface VsCheckboxStyleSet extends SizeStyleSet, BoxStyleSet, TextStyleSet {
    // Checkbox specific styles
    borderWidth?: string;
    checkboxColor?: string;
    checkboxSize?: string;

    // Label styles for different states
    label?: TextStyleSet;
    checkedLabel?: TextStyleSet;
    indeterminateLabel?: TextStyleSet;
}

export interface VsCheckboxSetStyleSet extends SizeStyleSet, BoxStyleSet, FlexStyleSet {
    // Nested checkbox styles
    checkbox?: VsCheckboxStyleSet;
}
