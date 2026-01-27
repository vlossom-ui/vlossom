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
        width?: string;
        label?: {
            marginBottom?: string;
            fontColor?: string;
            fontSize?: string;
            fontWeight?: number;
        };
        messages?: {
            marginTop?: string;
        };
    };
    component?: CSSProperties;
    messages?: {
        size?: Size;
    };
}
