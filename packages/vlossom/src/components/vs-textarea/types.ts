import type { VsInputWrapperStyleSet } from '@/main';
import type { InputRef, BoxStyleSet, TextStyleSet } from '@/declaration';

export type InputValueType = string;

export interface VsTextareaRef extends InputRef {
    select: () => void;
}

export interface VsTextareaStyleSet extends BoxStyleSet, TextStyleSet {
    height?: string;
    resize?: string;

    wrapper?: VsInputWrapperStyleSet;
}
