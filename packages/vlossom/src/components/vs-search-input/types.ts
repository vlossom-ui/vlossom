import type VsSearchInput from './VsSearchInput.vue';
import type { FocusableRef } from '@/declaration';
import type { VsInputStyleSet } from '@/components/vs-input/types';

declare module 'vue' {
    interface GlobalComponents {
        VsSearchInput: typeof VsSearchInput;
    }
}

export interface VsSearchInputStyleSet extends Omit<VsInputStyleSet, 'append' | 'prepend' | 'wrapper'> {}

export interface VsSearchInputRef extends FocusableRef {
    match: (text: string) => boolean;
    select: () => void;
}
