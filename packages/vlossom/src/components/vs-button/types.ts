import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type { VsLoadingStyleSet } from '@/components/vs-loading/types';
import type VsButton from './VsButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsButton: typeof VsButton;
    }
}

export type { VsButton };

export interface VsButtonRef extends ComponentPublicInstance<typeof VsButton> {}

export interface VsButtonStyleSet extends SizeStyleSet, BoxStyleSet {
    fontColor?: string;

    loading?: VsLoadingStyleSet;
}
