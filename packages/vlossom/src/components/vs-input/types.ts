import type VsInput from './VsInput.vue';
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

type VsAttachmentStyleSet = Omit<BoxStyleSet, 'display' | 'border' | 'borderRadius'> &
    Omit<TextStyleSet, 'fontWeight' | 'lineHeight' | 'whiteSpace'>;

type InputStyleSet = Omit<BoxStyleSet, 'display' | 'opacity'> &
    Omit<TextStyleSet, 'fontWeight' | 'lineHeight' | 'whiteSpace'>;

export interface VsInputStyleSet extends InputStyleSet {
    append?: VsAttachmentStyleSet;
    height?: string;
    prepend?: VsAttachmentStyleSet;
}
