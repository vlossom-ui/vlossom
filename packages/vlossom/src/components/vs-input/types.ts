import type VsInput from './VsInput.vue';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type { BoxStyleSet, TextStyleSet, FocusableRef, FormChildRef } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsInput: typeof VsInput;
    }
}

export type VsInputValueType = string | number | null;

export type VsInputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

export interface VsInputRef extends FocusableRef, FormChildRef {
    select: () => void;
}

type VsAttachmentStyleSet = Omit<BoxStyleSet, 'border' | 'borderRadius'>;

export interface VsInputStyleSet extends BoxStyleSet, TextStyleSet {
    append?: VsAttachmentStyleSet;
    height?: string;
    prepend?: VsAttachmentStyleSet;

    wrapper?: VsInputWrapperStyleSet;
}
