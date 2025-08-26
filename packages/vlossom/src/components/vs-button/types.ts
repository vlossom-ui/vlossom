import type VsButton from './VsButton.vue';
import type { BoxStyleSet, TextStyleSet } from '@/declaration';
import type { VsLoadingStyleSet } from '@/components/vs-loading/types';

declare module 'vue' {
    interface GlobalComponents {
        VsButton: typeof VsButton;
    }
}

export type { VsButton };

export interface VsButtonStyleSet extends BoxStyleSet, TextStyleSet {
    loading?: VsLoadingStyleSet;
}
