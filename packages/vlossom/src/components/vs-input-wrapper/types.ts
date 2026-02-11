import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsInputWrapper from './VsInputWrapper.vue';
import type { VsMessageStyleSet } from '@/components/vs-message/types';

declare module 'vue' {
    interface GlobalComponents {
        VsInputWrapper: typeof VsInputWrapper;
    }
}

export type { VsInputWrapper };

export interface VsInputWrapperRef extends ComponentPublicInstance<typeof VsInputWrapper> {}

export interface VsInputWrapperStyleSet {
    component?: CSSProperties;
    label?: CSSProperties;
    messages?: CSSProperties;
    message?: VsMessageStyleSet;
}
