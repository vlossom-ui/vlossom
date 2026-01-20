import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsSkeleton from './VsSkeleton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSkeleton: typeof VsSkeleton;
    }
}

export type { VsSkeleton };

export interface VsSkeletonRef extends ComponentPublicInstance<typeof VsSkeleton> {}

export interface VsSkeletonStyleSet {
    variables?: {
        backgroundColor?: string;
        fontColor?: string;
    };
    component?: CSSProperties;
}
