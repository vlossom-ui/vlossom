import type { ComponentPublicInstance } from 'vue';
import type VsInputWrapper from './VsInputWrapper.vue';
import type { TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsInputWrapper: typeof VsInputWrapper;
    }
}

export type { VsInputWrapper };

export interface VsInputWrapperRef extends ComponentPublicInstance<typeof VsInputWrapper> {}

export interface VsInputWrapperStyleSet {
    label?: TextStyleSet & {
        marginBottom?: string;
    };

    messages?: {
        marginTop?: string;
        fontSize?: string;
    };
}
