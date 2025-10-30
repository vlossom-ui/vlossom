import type VsSwitch from './VsSwitch.vue';
import type { SizeStyleSet, VsInputWrapperStyleSet } from '@/main';

declare module 'vue' {
    interface GlobalComponents {
        VsSwitch: typeof VsSwitch;
    }
}

export interface VsSwitchStyleSet extends SizeStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontColor?: string;
    handleColor?: string;
    handleSize?: string;

    wrapper?: VsInputWrapperStyleSet;
}
