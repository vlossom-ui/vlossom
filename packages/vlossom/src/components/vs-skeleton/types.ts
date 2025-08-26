import type VsSkeleton from './VsSkeleton.vue';
import type { BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsSkeleton: typeof VsSkeleton;
    }
}

export type { VsSkeleton };

export interface VsSkeletonStyleSet extends Omit<BoxStyleSet, 'display' | 'opacity'>, TextStyleSet {}
