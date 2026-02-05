import type { ComponentPublicInstance } from 'vue';
import type { FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsCheckbox from './VsCheckbox.vue';
import type VsCheckboxSet from './VsCheckboxSet.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsCheckbox: typeof VsCheckbox;
        VsCheckboxSet: typeof VsCheckboxSet;
    }
}

export type { VsCheckbox, VsCheckboxSet };

export interface VsCheckboxRef extends ComponentPublicInstance<typeof VsCheckbox>, FocusableRef, FormChildRef {
    toggle: () => void;
}

export interface VsCheckboxSetRef extends ComponentPublicInstance<typeof VsCheckboxSet>, FocusableRef, FormChildRef {}

export interface VsCheckboxStyleSet {
    variables?: {
        borderRadius?: string;
        borderWidth?: string;
        checkboxColor?: string;
        checkboxSize?: string;
        height?: string;
    };
    wrapper?: VsInputWrapperStyleSet;
}

export interface VsCheckboxSetStyleSet {
    checkbox?: Omit<VsCheckboxStyleSet, 'wrapper'>;
    wrapper?: VsInputWrapperStyleSet;
}
