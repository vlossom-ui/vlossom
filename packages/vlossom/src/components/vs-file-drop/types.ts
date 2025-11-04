import type VsFileDrop from './VsFileDrop.vue';
import type { VsInputWrapperStyleSet } from '@/main';
import type { BoxStyleSet, Breakpoints, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsFileDrop: typeof VsFileDrop;
    }
}

export type FileDropValueType = File[] | null;

export interface VsFileDropStyleSet extends BoxStyleSet, TextStyleSet {
    dragBackgroundColor?: string;
    height?: string | number | Breakpoints;
    iconColor?: string;

    wrapper?: VsInputWrapperStyleSet;
}
