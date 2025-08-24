import type { VsLoadingStyleSet } from '@/components/vs-loading/types';
import type VsButton from './VsButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsButton: typeof VsButton;
    }
}

export type { VsButton };

export interface VsButtonStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    height?: string;
    padding?: string;
    width?: string;
    loading?: VsLoadingStyleSet;
}
