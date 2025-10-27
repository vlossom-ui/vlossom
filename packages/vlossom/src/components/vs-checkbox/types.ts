import type VsCheckbox from './VsCheckbox.vue';
import type VsCheckboxSet from './VsCheckboxSet.vue';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';

declare module 'vue' {
    interface GlobalComponents {
        VsCheckbox: typeof VsCheckbox;
        VsCheckboxSet: typeof VsCheckboxSet;
    }
}

export type { VsCheckbox, VsCheckboxSet };

export interface VsCheckboxStyleSet {
    borderRadius?: string;
    borderWidth?: string;
    checkboxColor?: string;
    checkboxSize?: string;
    height?: string;

    wrapper?: VsInputWrapperStyleSet;
}

export interface VsCheckboxSetStyleSet {
    gap?: string;
    flexWrap?: string;

    checkbox?: VsCheckboxStyleSet;
    wrapper?: VsInputWrapperStyleSet;
}
