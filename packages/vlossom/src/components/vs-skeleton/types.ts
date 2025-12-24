import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type VsSkeleton from './VsSkeleton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSkeleton: typeof VsSkeleton;
    }
}

export type { VsSkeleton };

export interface VsSkeletonRef extends ComponentPublicInstance<typeof VsSkeleton> {}

export interface VsSkeletonStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding' | 'opacity'> {
    fontColor?: string;
}
