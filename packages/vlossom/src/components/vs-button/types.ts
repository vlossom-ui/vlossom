import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { VsLoadingStyleSet } from '@/components/vs-loading/types';
import type VsButton from './VsButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsButton: typeof VsButton;
    }
}

export type { VsButton };

export interface VsButtonRef extends ComponentPublicInstance<typeof VsButton> {}

export interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
