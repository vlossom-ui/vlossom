import type VsInput from './VsInput.vue';
import type { VsInputWrapperStyleSet } from '@/main';
import type { InputRef, BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsInput: typeof VsInput;
    }
}

export type InputValueType = string | number | null;

export type InputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

export interface VsInputRef extends InputRef {
    select: () => void;
}

type VsAttachmentStyleSet = Omit<BoxStyleSet, 'border' | 'borderRadius'>;

export interface VsInputStyleSet extends BoxStyleSet, TextStyleSet {
    append?: VsAttachmentStyleSet;
    height?: string;
    prepend?: VsAttachmentStyleSet;

    wrapper?: VsInputWrapperStyleSet;
}
