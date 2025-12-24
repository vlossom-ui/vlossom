import type { ComponentPublicInstance } from 'vue';
import type { FocusableRef } from '@/declaration';
import type { VsInputStyleSet } from '@/components/vs-input/types';
import type VsSearchInput from './VsSearchInput.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSearchInput: typeof VsSearchInput;
    }
}

export type { VsSearchInput };

export interface VsSearchInputRef extends ComponentPublicInstance<typeof VsSearchInput>, FocusableRef {
    match: (text: string) => boolean;
    select: () => void;
}

export interface VsSearchInputStyleSet extends Omit<VsInputStyleSet, 'append' | 'prepend' | 'wrapper'> {}
