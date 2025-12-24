import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, TextStyleSet, FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsInput from './VsInput.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsInput: typeof VsInput;
    }
}

export type { VsInput };

export interface VsInputRef extends ComponentPublicInstance<typeof VsInput>, FocusableRef, FormChildRef {
    select: () => void;
}

export type VsInputValueType = string | number | null;

export type VsInputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

export type VsAttachmentStyleSet = Omit<BoxStyleSet, 'border' | 'borderRadius'>;

export interface VsInputStyleSet extends BoxStyleSet, TextStyleSet {
    append?: VsAttachmentStyleSet;
    height?: string;
    prepend?: VsAttachmentStyleSet;

    wrapper?: VsInputWrapperStyleSet;
}
