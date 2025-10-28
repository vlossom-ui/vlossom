import type { SizeStyleSet, VsInputWrapperStyleSet } from '@/main';

export interface VsSwitchStyleSet extends SizeStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontColor?: string;
    handleColor?: string;
    handleSize?: string;

    wrapper?: VsInputWrapperStyleSet;
}
