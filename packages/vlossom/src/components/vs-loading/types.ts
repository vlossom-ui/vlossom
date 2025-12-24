import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet } from '@/declaration';
import type VsLoading from './VsLoading.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsLoading: typeof VsLoading;
    }
}

export type { VsLoading };

export interface VsLoadingRef extends ComponentPublicInstance<typeof VsLoading> {}

export interface VsLoadingStyleSet extends SizeStyleSet {
    color?: string;
    barWidth?: string;
}
