import type VsSkeleton from './VsSkeleton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSkeleton: typeof VsSkeleton;
    }
}

export * from './types';
export type { VsSkeleton };
