import type { ComponentPublicInstance, CSSProperties } from 'vue';
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
        handleColor?: string;
        handleSize?: string;
    };
    switchButton?: CSSProperties;
    checkedSwitchButton?: CSSProperties;
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
