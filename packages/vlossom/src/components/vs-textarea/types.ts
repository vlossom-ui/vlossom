import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, TextStyleSet, FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsTextarea from './VsTextarea.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTextarea: typeof VsTextarea;
    }
}

export type { VsTextarea };

export interface VsTextareaRef extends ComponentPublicInstance<typeof VsTextarea>, FocusableRef, FormChildRef {
    select: () => void;
}

export type VsTextareaValueType = string;

export interface VsTextareaStyleSet extends BoxStyleSet, TextStyleSet {
    height?: string;
    resize?: string;

    wrapper?: VsInputWrapperStyleSet;
}
