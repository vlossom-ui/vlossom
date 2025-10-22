import type VsCheckbox from './VsCheckbox.vue';
import type { SizeStyleSet, BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsCheckbox: typeof VsCheckbox;
    }
}

export type { VsCheckbox };

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
