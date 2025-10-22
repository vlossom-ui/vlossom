import type VsCheckbox from './VsCheckbox.vue';
import type VsCheckboxSet from './VsCheckboxSet.vue';
import type { SizeStyleSet, BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsCheckbox: typeof VsCheckbox;
        VsCheckboxSet: typeof VsCheckboxSet;
    }
}

export type { VsCheckbox, VsCheckboxSet };

export interface VsCheckboxStyleSet extends SizeStyleSet, BoxStyleSet, TextStyleSet {
    checkboxColor?: string;
    checkboxSize?: string;
    label?: TextStyleSet;
    checkedLabel?: TextStyleSet;
    indeterminateLabel?: TextStyleSet;
}

export interface VsCheckboxSetStyleSet extends SizeStyleSet, BoxStyleSet {
    gap?: string;
    flexWrap?: string;
    checkbox?: VsCheckboxStyleSet;
}
