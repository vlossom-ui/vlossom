import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsInputWrapper from './VsInputWrapper.vue';
import type { Size } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsInputWrapper: typeof VsInputWrapper;
    }
}

export type { VsInputWrapper };

export interface VsInputWrapperRef extends ComponentPublicInstance<typeof VsInputWrapper> {}

export interface VsInputWrapperStyleSet {
    variables?: {
        label?: {
            marginBottom?: string;
            fontColor?: string;
            fontSize?: string;
            fontWeight?: number;
            messagesMarginTop?: string;
        };
    };
    component?: CSSProperties;
    messages?: {
        size?: Size;
    };
}
