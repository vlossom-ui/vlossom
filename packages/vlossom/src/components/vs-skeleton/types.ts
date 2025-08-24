import type { VsTextStyleSet } from '@/declaration';
import type VsSkeleton from './VsSkeleton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSkeleton: typeof VsSkeleton;
    }
}

export type { VsSkeleton };

export interface VsSkeletonStyleSet extends VsTextStyleSet {
    backgroundColor?: string;
    borderRadius?: string;
    height?: string;
    width?: string;
}
