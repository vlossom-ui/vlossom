import type VsDivider from './VsDivider.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDivider: typeof VsDivider;
    }
}

export * from './types';
export type { VsDivider };
