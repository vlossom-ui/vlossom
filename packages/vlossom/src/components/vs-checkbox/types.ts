import type VsCheckbox from './VsCheckbox.vue';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';

declare module 'vue' {
    interface GlobalComponents {
        VsCheckbox: typeof VsCheckbox;
    }
}

export type { VsCheckbox };

export interface VsCheckboxStyleSet {
    borderRadius?: string;
    borderWidth?: string;
    checkboxColor?: string;
    checkboxSize?: string;
    height?: string;

    wrapper?: VsInputWrapperStyleSet;
}
