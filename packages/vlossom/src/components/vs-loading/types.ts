import type VsLoading from './VsLoading.vue';
import type { SizeStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsLoading: typeof VsLoading;
    }
}

export type { VsLoading };

export interface VsLoadingStyleSet extends SizeStyleSet {
    color?: string;
    barWidth?: string;
}
