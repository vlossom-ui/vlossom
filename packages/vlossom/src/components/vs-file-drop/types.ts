import type VsFileDrop from './VsFileDrop.vue';
import type { VsInputWrapperStyleSet } from '@/main';
import type { BoxStyleSet, Breakpoints } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsFileDrop: typeof VsFileDrop;
    }
}

export type FileDropValueType = File[] | null;

export interface VsFileDropStyleSet extends BoxStyleSet {
    width?: string | number | Breakpoints;
    height?: string | number | Breakpoints;
    dragBackgroundColor?: string;
    iconColor?: string;

    wrapper?: VsInputWrapperStyleSet;
}
