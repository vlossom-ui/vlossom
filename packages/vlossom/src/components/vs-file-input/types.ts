import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { FocusableRef, FormChildRef } from '@/declaration';
import type { VsChipStyleSet } from '@/components/vs-chip/types';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsFileInput from './VsFileInput.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFileInput: typeof VsFileInput;
    }
}

export type { VsFileInput };

export interface VsFileInputRef extends ComponentPublicInstance<typeof VsFileInput>, FocusableRef, FormChildRef {}

export type FileInputValueType = File[];

export interface VsFileInputStyleSet extends CSSProperties {
    $prepend?: CSSProperties;
    $append?: CSSProperties;
    $chip?: VsChipStyleSet;
    $wrapper?: VsInputWrapperStyleSet;
}
