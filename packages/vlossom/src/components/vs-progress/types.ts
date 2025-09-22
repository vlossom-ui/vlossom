import type VsProgress from './VsProgress.vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsProgress: typeof VsProgress;
    }
}

export type { VsProgress };

export interface VsProgressStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'display' | 'opacity' | 'padding'> {
    valueColor?: string;
}
