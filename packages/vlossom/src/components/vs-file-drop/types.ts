import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, Breakpoints, FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsFileDrop from './VsFileDrop.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFileDrop: typeof VsFileDrop;
    }
}

export type { VsFileDrop };

export interface VsFileDropRef extends ComponentPublicInstance<typeof VsFileDrop>, FocusableRef, FormChildRef {}

export type FileDropValueType = File[];

export interface VsFileDropStyleSet extends BoxStyleSet {
    width?: string | number | Breakpoints;
    height?: string | number | Breakpoints;
    dragBackgroundColor?: string;
    iconColor?: string;

    wrapper?: VsInputWrapperStyleSet;
}
