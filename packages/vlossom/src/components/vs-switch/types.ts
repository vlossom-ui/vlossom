import type { ComponentPublicInstance } from 'vue';
import type { FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsSwitch from './VsSwitch.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSwitch: typeof VsSwitch;
    }
}

export type { VsSwitch };

export interface VsSwitchRef extends ComponentPublicInstance<typeof VsSwitch>, FocusableRef, FormChildRef {}

export interface VsSwitchStyleSet {
    variables?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        fontColor?: string;
        handleColor?: string;
        handleSize?: string;
    };
    wrapper?: VsInputWrapperStyleSet;
}
