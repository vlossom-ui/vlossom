import type VsInputWrapper from './VsInputWrapper.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsInputWrapper: typeof VsInputWrapper;
    }
}

export type { VsInputWrapper };

export interface VsInputWrapperStyleSet {
    label?: {
        marginBottom?: string;
        fontColor?: string;
        fontSize?: string;
        fontWeight?: string;
    };
    messages?: {
        marginTop?: string;
        fontSize?: string;
    };
}
