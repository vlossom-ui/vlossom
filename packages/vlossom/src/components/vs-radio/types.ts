import type VsRadio from './VsRadio.vue';
import type VsRadioSet from './VsRadioSet.vue';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';

declare module 'vue' {
    interface GlobalComponents {
        VsRadio: typeof VsRadio;
        VsRadioSet: typeof VsRadioSet;
    }
}

export type { VsRadio, VsRadioSet };

export interface VsRadioStyleSet {
    borderRadius?: string;
    height?: string;
    radioColor?: string;
    radioSize?: string;
}

export interface VsRadioSetStyleSet {
    gap?: string;
    flexWrap?: string;

    radio?: Omit<VsRadioStyleSet, 'wrapper'>;
    wrapper?: VsInputWrapperStyleSet;
}
