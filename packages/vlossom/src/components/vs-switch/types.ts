import type { SizeStyleSet, VsInputWrapperStyleSet } from '@/main';

interface VsSwitchStateStyleSet {
    backgroundColor?: string;
    border?: string;
    fontColor?: string;
    handleColor?: string;
}

export interface VsSwitchStyleSet extends SizeStyleSet {
    borderRadius?: string;
    fontSize?: string;
    handleSize?: string;
    false?: VsSwitchStateStyleSet;
    true?: VsSwitchStateStyleSet;

    wrapper?: VsInputWrapperStyleSet;
}
