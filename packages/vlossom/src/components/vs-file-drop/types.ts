import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { FocusableRef, FormChildRef } from '@/declaration';
import type { VsChipStyleSet } from '@/components/vs-chip/types';
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

export interface VsFileDropStyleSet {
    variables?: {
        dragBackgroundColor?: string;
        iconColor?: string;
    };
    component?: CSSProperties;
    placeholder?: CSSProperties;
    files?: CSSProperties;
    closeButton?: CSSProperties;
    chip?: VsChipStyleSet;
    wrapper?: VsInputWrapperStyleSet;
}
