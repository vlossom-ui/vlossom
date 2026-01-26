import type { ComponentPublicInstance } from 'vue';
import type { FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsRadio from './VsRadio.vue';
import type VsRadioSet from './VsRadioSet.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsRadio: typeof VsRadio;
        VsRadioSet: typeof VsRadioSet;
    }
}

export type { VsRadio, VsRadioSet };

export interface VsRadioRef extends ComponentPublicInstance<typeof VsRadio>, FocusableRef, FormChildRef {}

export interface VsRadioSetRef extends ComponentPublicInstance<typeof VsRadioSet>, FocusableRef, FormChildRef {}

export interface VsRadioStyleSet {
    variables?: {
        borderRadius?: string;
        height?: string;
        radioColor?: string;
        radioSize?: string;
    };
    wrapper?: VsInputWrapperStyleSet;
}

export interface VsRadioSetStyleSet {
    variables?: {
        gap?: string;
        flexWrap?: string;
    };
    radio?: VsRadioStyleSet;
    wrapper?: VsInputWrapperStyleSet;
}
