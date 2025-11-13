import type VsTextarea from './VsTextarea.vue';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type { InputRef, BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsTextarea: typeof VsTextarea;
    }
}

export type VsTextareaValueType = string;

export interface VsTextareaRef extends InputRef {
    select: () => void;
}

export interface VsTextareaStyleSet extends BoxStyleSet, TextStyleSet {
    height?: string;
    resize?: string;

    wrapper?: VsInputWrapperStyleSet;
}
